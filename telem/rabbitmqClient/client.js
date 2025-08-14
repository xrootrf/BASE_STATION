const { connect } = require("amqplib");
const { Consumer } = require("./consumer");
const { Producer } = require("./producer");
const { rabbitMQBase } = require("../rabbitmqBase/client");

class RabbitMQClient {
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
    await rabbitMQBase.initialize();
   
    if (this.isInitialized) {
      return;
    }
    while(!this.isInitialized){
    try {
      this.connection = await connect("amqp://user:password@droneuse.com:5673");
      console.log("connected to rabbitmq");
      this.producerChannel = await this.connection.createChannel();
      this.consumerChannel = await this.connection.createChannel();
      const { queue: replyQueueName } = await this.consumerChannel.assertQueue(
        "6384a26eeb99ea2bf400d32f",
        {
           durable:true
        }
      );
      this.producer = new Producer(this.producerChannel, replyQueueName);
      this.consumer = new Consumer(
        this.consumerChannel,
        replyQueueName,
        this,
        rabbitMQBase
      );
      this.consumer.consumeMessage();
      this.isInitialized = true;
    } catch (err) {
      console.log("===============cant connect to server rabbit  !!===============");
      console.log(err);
      await new Promise(resolve=>setTimeout(resolve ,2000))
    }
  }

  }

  async produce(queue, data, correlationId) {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return await this.producer.produceMessage(queue, data, correlationId);
  }
}

module.exports = { rabbitMQClient: new RabbitMQClient() };
