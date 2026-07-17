/**
 * Student session regression test — typing, revocation, refresh.
 *
 *   cd server && npm run test:session
 *
 * The properties under test, and why they exist:
 *  - A JWT cannot be recalled once signed. User.tokenVersion is the only thing
 *    that can end a stolen session before its TTL. If "revocation works" ever
 *    fails, a stolen token is valid for a full week and nothing can stop it.
 *  - Legacy bare { id } tokens must keep working: tightening that logs out the
 *    entire live userbase. They die only once their own account revokes.
 *  - Every role's token is signed with the same secret, so cross-role rejection
 *    is claim-based and must be asserted, not assumed.
 *
 * Runs against a throwaway in-memory Mongo; touches no real data.
 */
process.env.JWT_SECRET = "session-test-secret";

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import authRoutes from "../routes/auth.js";
import User from "../models/User.js";

const mem = await MongoMemoryServer.create();
await mongoose.connect(mem.getUri("session-test"));
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
const srv = app.listen(0);
const base = `http://127.0.0.1:${srv.address().port}`;

const call = (p, o = {}) => fetch(base + p, {
  method: o.method || "GET",
  headers: { "content-type": "application/json", ...(o.token ? { authorization: `Bearer ${o.token}` } : {}) },
  body: o.body ? JSON.stringify(o.body) : undefined,
}).then(async (r) => ({ status: r.status, body: await r.json().catch(() => ({})) }));

let fail = 0;
const check = (l, c, x = "") => { if (!c) fail++; console.log(`  ${c ? "PASS" : "FAIL"}  ${l}${x ? "  " + x : ""}`); };
const mkUser = (email, phone) => call("/api/auth/signup", { method: "POST", body: {
  name: "T", email, phone, coaching: "X", homeState: "RJ", password: "secret123" } });

console.log("\ntoken shape\n");
const signup = await mkUser("a@gmail.com", "9998887770");
check("signup issues a token", signup.status === 201, `-> ${signup.status}`);
let token = signup.body.token;
const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
check("typed as student", payload.typ === "student", `typ=${payload.typ}`);
check("pins a token version", payload.v === 0, `v=${payload.v}`);
check("TTL is 7 days, not 30", Math.round((payload.exp - payload.iat) / 86400) === 7);

console.log("\nrevocation\n");
const tokenB = (await call("/api/auth/login", { method: "POST", body: { email: "a@gmail.com", password: "secret123" } })).body.token;
check("second device signs in", (await call("/api/auth/me", { token: tokenB })).status === 200);
const la = await call("/api/auth/logout-all", { method: "POST", token });
check("logout-all succeeds", la.status === 200);
check("other device's token is DEAD  <-- the point of tokenVersion",
  (await call("/api/auth/me", { token: tokenB })).status === 401);
check("current device stays signed in", (await call("/api/auth/me", { token: la.body.token })).status === 200);
check("a revoked token cannot refresh itself",
  (await call("/api/auth/refresh", { method: "POST", token: tokenB })).status === 401);

console.log("\nrefresh\n");
const rf = await call("/api/auth/refresh", { method: "POST", token: la.body.token });
check("refresh mints a working token",
  rf.status === 200 && (await call("/api/auth/me", { token: rf.body.token })).status === 200);

console.log("\nlegacy tokens (must NOT mass-logout the live userbase)\n");
await mkUser("legacy@gmail.com", "9998887771");
const lu = await User.findOne({ email: "legacy@gmail.com" });
check("existing account starts at version 0", (lu.tokenVersion || 0) === 0);
const legacy = jwt.sign({ id: String(lu._id) }, process.env.JWT_SECRET, { expiresIn: "30d" });
check("legacy bare { id } token still works", (await call("/api/auth/me", { token: legacy })).status === 200);
const lFresh = (await call("/api/auth/login", { method: "POST", body: { email: "legacy@gmail.com", password: "secret123" } })).body.token;
await call("/api/auth/logout-all", { method: "POST", token: lFresh });
check("...and dies once that account revokes", (await call("/api/auth/me", { token: legacy })).status === 401);

console.log("\npassword reset evicts every session\n");
await mkUser("reset@gmail.com", "9998887772");
const rTok = (await call("/api/auth/login", { method: "POST", body: { email: "reset@gmail.com", password: "secret123" } })).body.token;
const ru = await User.findOne({ email: "reset@gmail.com" });
const raw = "reset-token-abc";
ru.resetTokenHash = crypto.createHash("sha256").update(raw).digest("hex");
ru.resetExpires = new Date(Date.now() + 3600e3);
await ru.save();
const done = await call("/api/auth/reset", { method: "POST", body: { token: raw, password: "brand-new-pass" } });
check("reset succeeds", done.status === 200, `-> ${done.status}`);
check("reset evicts the pre-existing session  <-- stolen token dies",
  (await call("/api/auth/me", { token: rTok })).status === 401);

console.log("\ncross-role\n");
check("admin token refused on student routes",
  (await call("/api/auth/me", { token: jwt.sign({ admin: true }, process.env.JWT_SECRET) })).status === 403);
check("mentor token refused on student routes",
  (await call("/api/auth/me", { token: jwt.sign({ typ: "mentor", id: String(lu._id), v: 0 }, process.env.JWT_SECRET) })).status === 403);

console.log(fail ? `\n${fail} FAILURE(S)` : "\nALL PASSED");
await mongoose.disconnect();
await mem.stop();
srv.close();
process.exit(fail ? 1 : 0);
