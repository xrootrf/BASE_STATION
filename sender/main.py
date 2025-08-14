import uvicorn
from fastapi import FastAPI, File, UploadFile, Form
from fastapi import FastAPI,Request
from typing import List
import httpx
import json
app= FastAPI()
import requests
import redis 
import time
import base64
import io
import uuid

r=redis.Redis(host="0.0.0.0",port=6382,db=0)

while True:
    try:
        print(r)
        item=r.rpop("metadata")
        data=json.loads(item)
        img=base64.b64decode(data["image"])
        img=io.BytesIO(img)
        print(img)
        files = {
            'file': (f"{uuid.uuid4()}",img,"image/jpeg")
        }
        dta={}
        dta["data"]=json.dumps(data["data"])
        requests.post("https://droneuse.com/api/detections/upload",files=files,data=dta)
        # print(data)
    except Exception as e:
        print(e)
    time.sleep(0.1)

@app.post("/api/detections/upload")
async def upload(file: UploadFile = File(...),
   data: str = Form(...)):
    
    # print(file_content)
    # Prepare multipart form data to forward
    img=await file.read()
    files = {
        'file': (file.filename,img,file.content_type)
    }
    print(data)
    
    data={"data":data}
    async with httpx.AsyncClient() as client:
        forward_response = await client.post("https://droneuse.com/api/detections/upload", files=files,data=data)

    return {
        "message": "Data received and forwarded",
        "forward_status_code": forward_response.status_code,
        "forward_response": forward_response.text
    }




if __name__ == "__main__":
    uvicorn.run(app,host="0.0.0.0",port=5050)
