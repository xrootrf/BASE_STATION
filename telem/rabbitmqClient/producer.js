class Producer {
  channel;
  replyQueueName;
  constructor(channel) {
    this.channel = channel;
  }
  async produceMessage(queue, data, correlationId) {
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
      correlationId,
      expiration: 10000,
    });
  }
}

module.exports = { Producer };
