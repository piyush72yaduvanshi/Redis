import express from "express";
import { emailQueue } from "./queues.js";

const app = express();
app.use(express.json());

app.post("/welcome-email", (req, res) => {
  const { email } = req.body;
  const job = emailQueue.add("send-welcome-email", {
    to: email,
    name: "John Doe",
    subject: "Welcome to our website!",
  },
  {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  }
);
  res.json({ message: "Email sent successfully", jobId: job.id });
});

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
});
