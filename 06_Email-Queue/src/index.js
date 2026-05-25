import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const QUEUE_KEY = "queue:emails";

app.post("/emails", async (req, res) => {
  const job = {
    to: req.body.to,
    subject: req.body.subject || "No Subject",
    body: req.body.body || "No Body",
    createdAt: new Date().toISOString(),
  };
  await redis.lpush(QUEUE_KEY, JSON.stringify(job));
  res.json({ status: "queued", job });
  
});


app.get("/emails/process-one", async (req, res) => {
  const rewJob = await redis.rpop(QUEUE_KEY);
  if (rewJob) {
    const job = JSON.parse(rewJob);
    // Simulate email sending
    console.log(`Sending email to ${job.to} with subject "${job.subject}"`);
    res.json({ status: "processed", job });
  } else {
    res.json({ status: "no jobs in queue" });
  }
});

app.listen(3000, () => {
  console.log("Email queue server is running on port 3000");
});