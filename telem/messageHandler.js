class MessageHandler {
redis
  constructer(redis){
    this.redis=redis

  }
  static async handle(
    redis,
    action,
    payload,
    target,
    correlationId,
    replyTo,
    rabbitMQClient,
    rabbitMQBase
  ) {
    switch (action) {
       case "movetrackeryaw":
          const {lat,lng}=payload
          console.log(lat,lng)
          if(lat){
            redis.set("lat",lat)
          }
          if(lng){
            redis.set("lng",lng)
          }
            redis.set("sats","32")
          
          console.log("asdasdasdasdasd moving tracker...")
          await rabbitMQClient.produce(replyTo, "", correlationId);
          return;
        case "movetrackerpitch":
          const {alt}=payload
          console.log(alt)
          
          if(alt){
            redis.set("alt",alt)
          }
            redis.set("sats","32")
          
          console.log("asdasdasdasdasd moving tracker...")
          await rabbitMQClient.produce(replyTo, "", correlationId);
          return;
     }
    const response = await rabbitMQBase.produce(target, { action, payload });
    await rabbitMQClient.produce(replyTo, JSON.parse(response), correlationId);
  }
}

module.exports = { MessageHandler };
