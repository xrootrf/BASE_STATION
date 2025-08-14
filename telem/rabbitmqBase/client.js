const { connect } = require("amqplib");
const { Consumer } = require("./consumer");
const { Producer } = require("./producer");

class RabbitMQBase {
  producer;
  consumer;
  connection;
  producerChannel;
  consumerChannel;
  isInitialized = false;
  // constructor() {}
  // static getInstance() {
  //   if (!this.instance) {
  //     this.instance = new RabbitMQClient();
  //   }
  //   return this.instance;
  // }
  async initialize() {
    if (this.isInitialized) {
      return;
    }
    while (!this.isInitialized)
    try {
      this.connection = await connect("amqp://user:password@0.0.0.0:5673");
      this.connection.on('close', function() {
    console.error("connection to RabbitMQ closed!");
    setTimeout(async()=>{
      this.connection = await connect("amqp://user:password@0.0.0.0:5673");
    }, 5000); // Retry connection after 10 seconds
});

this.connection.on('error', function(err) {
    console.error(err);
   setTimeout(async()=>{
      this.connection = await connect("amqp://user:password@0.0.0.0:5673");
    }, 5000); // Retry connection after 10 seconds
});
      console.log("connected to rabbitmq");
      this.producerChannel = await this.connection.createChannel();
      this.consumerChannel = await this.connection.createChannel();
      const { queue: replyQueueName } = await this.consumerChannel.assertQueue(
        "",
        {
          exclusive: true,
        }
      );
      this.producer = new Producer(this.producerChannel, replyQueueName);
      this.consumer = new Consumer(this.consumerChannel, replyQueueName, this);
      this.consumer.consumeMessage();
      this.isInitialized = true;

    } catch (err) {
      console.log("===============cant connect to base rabbit !!===============");

      console.log(err);
    }
  }

  async produce(queue, data) {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return await this.producer.produceMessage(queue, data);
  }
}

module.exports = { rabbitMQBase: new RabbitMQBase() };
