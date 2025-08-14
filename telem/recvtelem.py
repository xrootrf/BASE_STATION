import socket 
import queue
import threading
import time 
import redis
import json

Messages= queue.Queue()



def recvMessages(Queue):
    print("waiting for messages in UDP socket to push in Queue")
    sock= socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
    server_address=('0.0.0.0',3030)
    sock.bind(server_address)
    while True:
        data,address=sock.recvfrom(4096)
        Queue.put(data)




def streamMessages(Queue):
    while True:
        try:
            r=redis.Redis(host='192.168.2.2',port=6379,password="Bazinga247")
            print("waiting for messages in Queue to push in redis")
            while True:
                    data=Queue.get()
                    data=json.loads(data)
                    print(data["droneTelem"])
                    r.publish("droneTelem",json.dumps(data["droneTelem"]))
                    # Queue.put(data)
        except Exception as e:
            print(e)

streamThread=threading.Thread(target=streamMessages,args=(Messages,))

streamThread.start()



time.sleep(5)
recvThread=threading.Thread(target=recvMessages,args=(Messages,))
recvThread.start()
streamThread.join()
recvThread.join()
