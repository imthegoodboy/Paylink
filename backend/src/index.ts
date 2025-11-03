import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { ethers } from "ethers";

dotenv.config();

const PORT = Number(process.env.PORT || 4000);
const MONGODB_URI = process.env.MONGODB_URI || "";
const RPC_URL = process.env.RPC_URL || "";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "";
const RECEIPT_NFT_ADDRESS = process.env.RECEIPT_NFT_ADDRESS || "";
const JWT_SECRET = process.env.JWT_SECRET || "change_me";

// Minimal ABIs (only events/functions used).
const PAYMENT_GATEWAY_ABI = [
  "event Payment(address indexed payer, address indexed receiver, address indexed token, uint256 amount, string slug, string memo, uint256 timestamp)"
];

const app = express();
app.use(cors());
app.use(express.json());

// Mongo models
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  name: String,
  walletAddress: String,
  slug: { type: String, unique: true }
}, { timestamps: true });

const paymentSchema = new mongoose.Schema({
  payer: String,
  receiver: String,
  token: String,
  amount: String,
  slug: String,
  memo: String,
  txHash: String,
  timestamp: Number
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
const Payment = mongoose.model("Payment", paymentSchema);

function auth(req: any, res: any, next: any) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

// Routes
app.post("/api/auth/signup", async (req, res) => {
  const { email, walletAddress, name } = req.body || {};
  if (!email || !walletAddress) return res.status(400).json({ error: "email and walletAddress required" });
  const existing = await User.findOne({ email });
  const user = existing || await User.create({ email, walletAddress, name });
  const token = jwt.sign({ userId: String(user._id) }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user });
});

app.get("/api/users/me", auth, async (req: any, res) => {
  const user = await User.findById(req.userId);
  res.json({ user });
});

app.post("/api/users/link", auth, async (req: any, res) => {
  const { desiredSlug } = req.body || {};
  if (!desiredSlug) return res.status(400).json({ error: "desiredSlug required" });
  const conflict = await User.findOne({ slug: desiredSlug });
  if (conflict) return res.status(409).json({ error: "slug taken" });
  const user = await User.findByIdAndUpdate(req.userId, { slug: desiredSlug }, { new: true });
  res.json({ user });
});

app.get("/api/payments/:slug", async (req, res) => {
  const { slug } = req.params;
  const list = await Payment.find({ slug }).sort({ createdAt: -1 }).limit(100);
  res.json({ payments: list });
});

// Resolve a user's wallet by slug (for payment receiver autofill)
app.get("/api/users/by-slug/:slug", async (req, res) => {
  const { slug } = req.params;
  if (!slug) return res.status(400).json({ error: "slug required" });
  const user = await User.findOne({ slug });
  if (!user) return res.status(404).json({ error: "user not found" });
  res.json({ walletAddress: user.walletAddress, name: user.name, slug: user.slug });
});

// Payments summary for dashboard analytics
app.get("/api/payments/summary/:slug", async (req, res) => {
  const { slug } = req.params;
  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const monthAgo = now - 30 * 24 * 60 * 60 * 1000;
  const all = await Payment.find({ slug }).sort({ createdAt: -1 }).limit(1000);
  const sum = (from: number) => all.filter(p => (p.timestamp || 0) * 1000 >= from).reduce((a, b: any) => a + Number(b.amount || 0), 0);
  res.json({
    totalCount: all.length,
    totalAmount: all.reduce((a, b: any) => a + Number(b.amount || 0), 0),
    last7d: { count: all.filter(p => (p.timestamp || 0) * 1000 >= weekAgo).length, amount: sum(weekAgo) },
    last30d: { count: all.filter(p => (p.timestamp || 0) * 1000 >= monthAgo).length, amount: sum(monthAgo) }
  });
});

// Simple health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("Mongo connected");

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const gateway = new ethers.Contract(CONTRACT_ADDRESS, PAYMENT_GATEWAY_ABI, provider);

  gateway.on("Payment", async (payer, receiver, token, amount, slug, memo, timestamp, event) => {
    try {
      await Payment.create({
        payer,
        receiver,
        token,
        amount: amount.toString(),
        slug,
        memo,
        txHash: event.log.transactionHash,
        timestamp: Number(timestamp)
      });
      console.log("Indexed payment:", slug, amount.toString());
    } catch (e) {
      console.error("Index error:", e);
    }
  });

  app.listen(PORT, () => console.log(`API on :${PORT}`));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


