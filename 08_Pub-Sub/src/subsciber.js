import Redis from "redis";

const subscriber = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

subscriber.subscribe("notifications", (err) => {
  if (err) {
    console.error("Error subscribing to channel:", err.message);
    return;
  }
  console.log("Subscribed Successfully");
});

subscriber.on("message", (channel, message) => {
  console.log(
    "Recieved message from channel:",
    channel,
    ":",
    JSON.parse(message),
  );
});

subscriber.on("error", (err) => {
  console.error("Redis error:", err.message);
});
