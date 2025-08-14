const { randomUUID } = require("crypto");
const { Emitter } = require("./emitter");

class Producer {
  channel;
  replyQueueName;
  constructor(channel, replyQueueName) {
    this.channel = channel;
    this.channel.on('close', (err) => {
            console.error('Channel closed:', err);
            // Optionally, you can attempt to recreate the channel here
        });

        this.channel.on('error', (err) => {
            console.error('Channel error:', err);
            // Optionally, you can attempt to recreate the channel here
        });
    this.replyQueueName = replyQueueName;
  }
  async produceMessage(queue, data) {
    const uuid = randomUUID();
    console.log("the corr id is " + uuid);
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
      replyTo: this.replyQueueName,
      correlationId: uuid,
      expiration: 10000,
    });

    return await new Promise((resolve) => {
      Emitter.on(uuid, (data) => {
        resolve(data);
      });
    });
  }
}

module.exports = { Producer };
