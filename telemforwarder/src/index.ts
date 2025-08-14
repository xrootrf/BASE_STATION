import dgram from "node:dgram";
// var os = require("os");
// var hostname = os.hostname({ 'no-warnings': true });
import Redis from "ioredis";
import {Data,Radio} from "./Telem"

import { exec } from 'child_process';
import  fs from 'fs';
import path from "node:path";
import { join } from 'path';

const filePath = join(__dirname, 'rssi.txt');
//let rssi=0

//setInterval(()=>{
//  try{
//  fs.readFile(filePath, 'utf8', (err, data) => {
//  if (err) {
//    console.error('Error reading file:', err);
//    return;
//  }
//  rssi=Number(data.split("level=")[1].split(" ")[0]);
//});  
//  }catch(err){console.log(err)}
//  
//},500)



const redis = new Redis({
  host: "0.0.0.0",
  port: 6382,
});

async function setDataToRedis(data: any) {
try{
// console.log(data)
  const droneId = data["droneId"];
  if ("heading" in data["telem"]) {
   
    // const val=await redis.get(`${droneId}:heading`)
    // console.log(val)
  }
  if ("gpsInfo" in data["telem"]) {
    // console.log(data)
    redis.set(
      `${droneId}:sats`,
      data["telem"]["gpsInfo"]["num_satellites"],
      "EX",
      2
    );
    redis.set(
      `${droneId}:fixType`,
      data["telem"]["gpsInfo"]["fix_type"],
      "EX",
      2
    );
  }
  if ("position" in data["telem"]) {
    // console.log(data)
    redis.set(
      `${droneId}:lat`,
      data["telem"]["position"]["latitude_deg"],
      "EX",
      2
    );
    redis.set(
      `${droneId}:lng`,
      data["telem"]["position"]["longitude_deg"],
      "EX",
      2
    );
    redis.set(
      `${droneId}:agl`,
      data["telem"]["position"]["relative_altitude_m"],
      "EX",
      2
    );
    redis.set(
      `${droneId}:msl`,
      data["telem"]["position"]["absolute_altitude_m"],
      "EX",
      2
    );
  }
  // let dta:any={}
  // dta["lat"]=await redis.get( `${droneId}:lat`)
  // dta["lng"]=await redis.get( `${droneId}:lng`)
  // dta["agl"]=await redis.get( `${droneId}:agl`)
  // dta["msl"]=await redis.get( `${droneId}:msl`)
  // dta["sats"]=await redis.get( `${droneId}:sats`)
  // dta["heading"]=await redis.get( `${droneId}:heading`)
  // dta["fixType"]=await redis.get( `${droneId}:fixType`)
  // console.log(dta)
}catch(err){
console.log(err)}
}
console.log("started telenm forwarder");
const socket = dgram.createSocket({ type: "udp4", reuseAddr: true });
socket.bind(3030);
socket.on("message", (msg) => {
  try{
    // console.log(msg)
    console.log(msg.length," bytes recieved ")
    const telem=Data.deserializeBinary(msg).toObject()
    telem.baseId="6384a26eeb99ea2bf400d32f"
    setDataToRedis(telem)
   //const radio=new Radio()
    

    //radio.rssi=rssi
    // if(telem.telem ){
    //    telem.telem.radio=radio
    //  }
    // console.log(telem.baseId)
    const data=Data.fromObject(telem)
    const bytes=data.serializeBinary()
    //let temp: any = JSON.parse(data.toString());

    socket.send(bytes, 3030, "192.168.1.88", (err, bytes) => {
    // socket.send(bytes, 3030, "122.180.30.164", (err, bytes) => {
      if (err) {
        console.error(err);
        return;
      }
      // console.log(bytes, " bytes sent...")
    });
   
  }catch(err){
    console.log("some error occured while forwarding the data ")
  }
  //setDataToRedis(temp);
  // temp = JSON.stringify({ "6384a26eeb99ea2bf400d32f": temp });
});
