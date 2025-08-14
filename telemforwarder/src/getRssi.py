import subprocess
import time

while True:
    time.sleep(0.5)
    try:    
        resp=subprocess.run('iwconfig  wlx00c0cab2ac24 | grep "Signal level"',shell=True,capture_output=True,text=True)
        if resp.returncode != 0:
            print("Command failed:", resp.stderr)
        else:
            print("Command output:")
            with open("rssi.txt", "w") as file:
                file.write(resp.stdout)
    except Exception as e:
        print(e)