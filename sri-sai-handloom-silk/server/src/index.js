import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import MongoStore from "connect-mongo";
import rateLimit from "express-rate-limit";
import session from "express-session";
import { Account, Product, Enquiry } from "./models.js";

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret || Buffer.byteLength(sessionSecret) < 32) {
  throw new Error("SESSION_SECRET must be set to a random value of at least 32 bytes.");
}

if (isProduction) app.set("trust proxy", 1);

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "20kb" }));
app.use(session({
  name: "sri-sai.sid",
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
    ttl: 7 * 24 * 60 * 60,
  }),
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts. Please try again in 15 minutes." },
});

function saveSession(req) {
  return new Promise((resolve, reject) => {
    req.session.save((error) => error ? reject(error) : resolve());
  });
}

function startUserSession(req, userId) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) {
        reject(error);
        return;
      }
      req.session.userId = userId.toString();
      saveSession(req).then(resolve, reject);
    });
  });
}

function publicAccount(account) {
  return { id: account._id, name: account.name, email: account.email };
}

app.get("/api/auth/me", async (req, res, next) => {
  if (!req.session.userId) {
    res.status(401).json({ error: "Not signed in." });
    return;
  }

  try {
    const account = await Account.findById(req.session.userId).select("name email");
    if (!account) {
      req.session.destroy((error) => {
        if (error) next(error);
        else res.status(401).json({ error: "Not signed in." });
      });
      return;
    }
    res.json({ user: publicAccount(account) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/register", authLimiter, async (req, res, next) => {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";

  if (!name || name.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    res.status(400).json({ error: "Enter your name and a valid email address." });
    return;
  }
  if (Buffer.byteLength(password) < 8 || Buffer.byteLength(password) > 72) {
    res.status(400).json({ error: "Password must be between 8 and 72 bytes." });
    return;
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const account = await Account.create({ name, email, passwordHash });
    await startUserSession(req, account._id);
    res.status(201).json({ user: publicAccount(account) });
  } catch (error) {
    if (error?.code === 11000) {
      res.status(409).json({ error: "An account with this email already exists." });
      return;
    }
    next(error);
  }
});

app.post("/api/auth/login", authLimiter, async (req, res, next) => {
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";

  if (!email || !password || email.length > 254 || Buffer.byteLength(password) > 72) {
    res.status(400).json({ error: "Enter your email and password." });
    return;
  }

  try {
    const account = await Account.findOne({ email });
    if (!account || !(await bcrypt.compare(password, account.passwordHash))) {
      res.status(401).json({ error: "Email or password is incorrect." });
      return;
    }
    await startUserSession(req, account._id);
    res.json({ user: publicAccount(account) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/logout", (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
      return;
    }
    res.clearCookie("sri-sai.sid", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
    });
    res.status(204).end();
  });
});

app.get("/api/products", async (_req, res) => {
  res.json(await Product.find().sort({ price: 1 }));
});

app.post("/api/enquiries", async (req, res) => {
  try {
    const { name, phone, message, product } = req.body;
    const saved = await Enquiry.create({ name, phone, message, product });
    res.status(201).json({ id: saved._id });
  } catch {
    res.status(400).json({ error: "Name and phone are required." });
  }
});

app.use((error, _req, res, _next) => {
  console.error("API request failed:", error);
  const status = Number.isInteger(error.status) && error.status >= 400 && error.status < 600
    ? error.status
    : 500;
  res.status(status).json({
    error: status === 400 ? "Invalid request body." : "The request could not be completed. Please try again.",
  });
});

const port = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(port, () => console.log(`API on :${port}`)))
  .catch((e) => { console.error("MongoDB connection failed:", e.message); process.exit(1); });
