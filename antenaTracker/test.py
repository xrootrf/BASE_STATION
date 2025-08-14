from pymavlink import mavutil
import time 
import redis
import os

port = '/dev/ttyUSB0'
baud_rate = 115200
droneId='6620e41e2ca5b155a6dea465'



lat=28.578752
lng=77.485442
msl=200
agl=5
sats=20
heading=90


print("started antinea tracker")


def send_gps_raw_int(latitude, longitude, altitude,sats):
        print(f"gps_raw_int: \t\tlat:{latitude}, \tlng:{longitude}, \tsats:{sats}")
        mav.mav.gps_raw_int_send(
            int(time.time() * 1e6),  # time_usec
            3,  # fix_type (3 = 3D fix)
            int((latitude* 1e7)),  # lat (degrees * 1e7)
            int(longitude* 1e7),  # lon (degrees * 1e7)
            int(altitude * 1000),  # alt (mm)
            0,  # eph 
            0,  # epv 
            0,  # vel 
            0,  # cog 
            sats  # satellites_visible 
        )

def send_global_position_int(latitude, longitude, altitude, relative_alt,heading):
        print(f"global_position_int: \tlat:{latitude}, \tlng:{longitude}, \talt:{altitude}, hdg:{heading}")
        mav.mav.global_position_int_send(
            int(time.time() * 1e3)% 4294967295,  # time_boot_ms 
            int((latitude* 1e7)),  # lat (degrees * 1e7)
            int(longitude* 1e7),   # lon ( degrees * 1e7)
            int(altitude * 1000),  # alt ( mm )
            int(relative_alt * 1000),  # relative_alt (mm )
            0,  # vx (NED , cm/s )
            0,  # vy (NED , cm/s )
            0,  # vz (NED , cm/s )
            heading  # hdg (, cdeg )
        )
i=0
while True:
    try:
        print("setting mavutil")
        mav = mavutil.mavlink_connection(port, baud=baud_rate)
        print("connecting redis")
        r=redis.Redis(host='0.0.0.0',port=6382)
        print("connected to redis")
        while True:
            try:
                
                if lat and lng and agl and msl and sats and heading:
                    print(lat,lng,agl,msl,sats,heading)
                    
                    #os.system('cls' if os.name == 'nt' else 'clear')
                    send_gps_raw_int(lat,lng,msl,sats)
                    # send_global_position_int(lat,lng,msl,agl,heading)

                # if i==200:
                #       i=0
                
                # if i==150:
                #     print("=========CHANGE===============")
                #     lat=28.579810
                #     lng=77.478061
                # if i==100:
                #     print("=========CHANGE===============")
                #     lat=28.579827
                #     lng=77.477904
                # if i==50:
                #     print("=========CHANGE===============")
                #     lat=28.579748
                #     lng=77.477867
                # if i==0:
                #     print("=========CHANGE===============")
                #     lat=28.579870 
                #     lng=77.477647
                # i=i+1
                # print(i)
            
                time.sleep(0.125)
                # i=i+1

            except Exception as e:
                print(e)
                time.sleep(2)

    except Exception as e:
        time.sleep(2)
        print(e)        



