import { Worker } from "bullmq";
import { emailQueue, connection } from "./queue.js";

const worker = new Worker(
  "emails",
  async (job) => {
    console.log(`Processing job ${job.id} with data:`, job.data, job.name);
    (await new Promise((resolve) => setTimeout(resolve, 1500)),
      console.log(`Job ${job.id} completed`, job.data, job.name, job.id));
  },
  { connection },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} has been completed`);
} );

worker.on("failed", (job, err) => {
  console.log(`Job ${job.id} has failed with error: ${err.message}`);
});