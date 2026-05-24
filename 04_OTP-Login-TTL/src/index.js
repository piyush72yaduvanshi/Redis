import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

function otpKey(phone) {
  return `otp:${phone}`;
}

app.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.set(otpKey(phone), otp, "EX", 30);
  res.json({ message: "OTP sent successfully", otp });
});

app.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;
  const storedOtp = await redis.get(otpKey(phone));
  if (storedOtp === otp) {
    res.json({ message: "OTP verified successfully" });
  } else if (storedOtp !== otp) {
    res.status(400).json({ error: "Invalid OTP" });
  }else {
    res.status(400).json({ error: "OTP expired" });
  }
  await redis.del(otpKey(phone));
});

app.get("/otp/:phone/ttl", async (req, res) => {
  const { phone } = req.params;
  const ttl = await redis.ttl(otpKey(phone));
  res.json({ ttl });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});