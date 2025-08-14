from pymavlink import mavutil
from pyrtcm import RTCMReader
from serial import Serial
import time
from redis_client import RedisClient

inject_seq_nr = 0
redisClient=RedisClient("rtcmdata","0.0.0.0",6382)
redisClient.connect()
    
# def send_rtcm_msg(data):
#     global inject_seq_nr
#     msglen = 180;
    
#     if (len(data) > msglen * 4):
#         print("RTCM: Message too large", len(data))
#         return
    
#     # How many messages will we send?
#     msgs = 0
#     if (len(data) % msglen == 0):
#         msgs = len(data) // msglen
#     else:
#         msgs = (len(data) // msglen) + 1

#     for a in range(0, msgs):
        
#         flags = 0
        
#         # Set the fragment flag if we're sending more than 1 packet.
#         if (msgs) > 1:
#             flags = 1
        
#         # Set the ID of this fragment
#         flags |= (a & 0x3) << 1
        
#         # Set an overall sequence number
#         flags |= (inject_seq_nr & 0x1f) << 3
        
        
#         amount = min(len(data) - a * msglen, msglen)
#         datachunk = data[a*msglen : a*msglen + amount]

#         master.mav.gps_rtcm_data_send(
#             flags,
#             len(datachunk),
#             bytearray(datachunk.ljust(180, b'\0')))
    
#     # Send a terminal 0-length message if we sent 2 or 3 exactly-full messages.     
#     if (msgs < 4) and (len(data) % msglen == 0) and (len(data) > msglen):
#         flags = 1 | (msgs & 0x3)  << 1 | (inject_seq_nr & 0x1f) << 3
#         master.mav.gps_rtcm_data_send(
#             flags,
#             0,
#             bytearray("".ljust(180, '\0')))        
#     inject_seq_nr += 1
    


# Create the connection
# master = mavutil.mavlink_connection('udpin:0.0.0.0:12345')
# Wait a heartbeat before sending commands
# master.wait_heartbeat()

stream = Serial("/dev/ttyACM0",57600,timeout=3)
rtcm_data = RTCMReader(stream)
(raw_data, parsed_data) = rtcm_data.read()

for (raw_data, parsed_data) in rtcm_data:
    #if not (parsed_data.DF002 == '4072'):
    print(parsed_data)
    # print(raw_data)
    # print(raw_data.hex())
    redisClient.redis.publish("rtcmdata",raw_data.hex().encode("utf-8"))
    # send_rtcm_msg(raw_data)
    print("-----sending RTCM data-----")
