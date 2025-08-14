from redis import Redis 

class RedisClient:
    def __init__(self,channel,host,port):
        self.channel=channel
        self.host=host
        self.port=port
        self.redis=None
        
    def connect(self):
        print(self.host,self.port)
        self.redis=Redis(self.host, self.port, retry_on_timeout=True)

   



