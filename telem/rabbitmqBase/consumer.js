const { MessageHandler } = require("../messageHandler");
const { Emitter } = require("./emitter");

class Consumer {
  channel;
  replyQueueName;
  rabbit;

  constructor(channel, replyQueueName, rabbit) {
    this.channel = channel;
    this.replyQueueName = replyQueueName;
    this.rabbit = rabbit;
  }
  async consumeMessage() {
    console.log(`ready to consume messages from ${this.replyQueueName}..!!   `);
    this.channel.consume(
      this.replyQueueName,
      async (message) => {
        const { correlationId } = message.properties;
        if (!correlationId) {
          console.log("missing correlation id data in command.....");
        } else {
          Emitter.emit(correlationId, message.content.toString());
        }
      },
      { noAck: true }
    );
  }
}

module.exports = { Consumer };
