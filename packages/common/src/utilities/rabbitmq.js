import amqp from "amqplib";
import config from "../config/index.js";

let connection, channel;

export const connectRabbitMQ = async () => {
  try {
    if (channel) return channel;

    console.log("🔄 Connecting to RabbitMQ...");
    connection = await amqp.connect(config.RABBITMQ_URL);

    connection.on("error", (err) => {
      console.error("RabbitMQ Connection Error:", err);
    });

    connection.on("close", () => {
      console.error("⚠️ RabbitMQ Connection Closed. Reconnecting...");
      setTimeout(connectRabbitMQ, 5000); // Try reconnecting after 5 sec
    });
    channel = await connection.createChannel();

    console.log("RabbitMQ Connected!");

    return channel;
  } catch (err) {
    console.error("Error connecting to RabbitMQ:", err.message || err);
    throw err; // Rethrow the error so the app knows the connection failed
  }
};

export const sendToQueue = async (queue, message) => {
  const ch = await connectRabbitMQ();
  await ch.assertQueue(queue, { durable: true });
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  console.log(`📩 Sent message to ${queue}`, message);
};

export const consumeQueue = async (queue, callback) => {
  const ch = await connectRabbitMQ();
  await ch.assertQueue(queue, { durable: true });

  console.log(`👂 Listening to queue: ${queue}`);
  ch.consume(queue, async (message) => {
    if (message) {
      const data = JSON.parse(message.content.toString());
      await callback(data);
      ch.ack(message);
    }
  });
};
