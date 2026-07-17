/**
 * Mentor authorization regression test.
 *
 * A mentor can read other people's study data, so the scoping here is the most
 * security-sensitive code in the app. This runs the real routes against a
 * throwaway in-memory Mongo — no production data is touched and no external
 * services are called.
 *
 *   cd server && npm run test:authz
 *
 * If you change anything under middleware/mentor.js, routes/mentor.js or
 * routes/adminMentors.js, run this. The check that matters most is
 * "CANNOT read UNASSIGNED student" — if that ever fails, a mentor can read a
 * student they were never given.
 */
process.env.JWT_SECRET = "authz-test-secret";
process.env.ADMIN_KEY = "authz-test-admin-key";

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import express from "express";
import { signAdminToken } from "../middleware/admin.js";
import mentorRoutes from "../routes/mentor.js";
import adminMentorRoutes from "../routes/adminMentors.js";
import Enrollment from "../models/Enrollment.js";
import MentorProgress from "../models/MentorProgress.js";

const mem = await MongoMemoryServer.create();
await mongoose.connect(mem.getUri("authz-test"));

const app = express();
app.use(express.json());
app.use("/api/admin/mentors", adminMentorRoutes);
app.use("/api/mentor", mentorRoutes);
const srv = app.listen(0);
const base = `http://127.0.0.1:${srv.address().port}`;

const ADMIN = signAdminToken();
const call = async (path, { method = "GET", body, token, admin } = {}) => {
  const r = await fetch(base + path, {
    method,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(admin ? { "x-admin-token": admin } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: r.status, body: await r.json().catch(() => ({})) };
};

let fail = 0;
const check = (label, cond, extra = "") => {
  if (!cond) fail++;
  console.log(`  ${cond ? "PASS" : "FAIL"}  ${label}${extra ? "  " + extra : ""}`);
};

const seedStudent = async (sid, email, name) => {
  await Enrollment.create({ studentId: sid, plan: "mentor-jee-2027", amount: 2499, name, email, status: "paid" });
  await MentorProgress.create({
    email, plan: "mentor-jee-2027",
    data: { entries: [{ date: "2026-07-16", hours: 5 }], tests: [], backlog: [] },
  });
};
await seedStudent("CP-2026-00042", "mine@example.com", "Assigned Student");
await seedStudent("CP-2026-00099", "other@example.com", "Someone Else");

console.log("\nadmin creates + assigns\n");
const created = await call("/api/admin/mentors", {
  method: "POST", admin: ADMIN,
  body: { name: "Test Mentor", email: "m@example.com", college: "IIT B" },
});
check("admin creates mentor", created.status === 201, `-> ${created.status}`);
const mentorId = created.body.mentor?.id;
const tempPassword = created.body.password;
check("temp password returned once", !!tempPassword && tempPassword.length >= 8);
check("mustChangePassword defaults true", created.body.mentor?.mustChangePassword === true);

const bad = await call(`/api/admin/mentors/${mentorId}/students`, {
  method: "POST", admin: ADMIN, body: { studentId: "CP-9999-00001" },
});
check("assigning a non-existent CP ID is refused", bad.status === 404, `-> ${bad.status}`);

const asg = await call(`/api/admin/mentors/${mentorId}/students`, {
  method: "POST", admin: ADMIN, body: { studentId: "CP-2026-00042" },
});
check("assigning a real CP ID works", asg.status === 200, `-> ${asg.status}`);

console.log("\nmentor login + forced password change\n");
let login = await call("/api/mentor/login", { method: "POST", body: { email: "m@example.com", password: "wrong-password" } });
check("wrong password rejected", login.status === 401, `-> ${login.status}`);

login = await call("/api/mentor/login", { method: "POST", body: { email: "m@example.com", password: tempPassword } });
check("temp password logs in", login.status === 200, `-> ${login.status}`);
let token = login.body.token;

const gated = await call("/api/mentor/students", { token });
check("student data BLOCKED until password changed", gated.status === 403, `-> ${gated.status}`);

const changed = await call("/api/mentor/password", {
  method: "POST", token,
  body: { currentPassword: tempPassword, newPassword: "a-strong-new-password" },
});
check("password change succeeds", changed.status === 200, `-> ${changed.status}`);

const oldTok = await call("/api/mentor/students", { token });
check("OLD token dead after password change", oldTok.status === 401, `-> ${oldTok.status}`);
token = changed.body.token;

console.log("\nread-only access, scoped to assigned students only\n");
const mine = await call("/api/mentor/students", { token });
check("lists exactly 1 assigned student", mine.body.students?.length === 1,
  `-> ${JSON.stringify(mine.body.students?.map((s) => s.studentId))}`);

const ok = await call("/api/mentor/students/CP-2026-00042/progress", { token });
check("can read ASSIGNED student's progress", ok.status === 200 && !!ok.body.data, `-> ${ok.status}`);

const denied = await call("/api/mentor/students/CP-2026-00099/progress", { token });
check("CANNOT read UNASSIGNED student  <-- the one that matters", denied.status === 404, `-> ${denied.status}`);
check("unassigned leaks no data", !denied.body.data);

const ghost = await call("/api/mentor/students/CP-9999-12345/progress", { token });
check("unassigned and nonexistent are indistinguishable", ghost.status === denied.status,
  `${ghost.status} === ${denied.status}`);

console.log("\nno write path to student data\n");
for (const [m, p] of [["PUT", "progress"], ["POST", "progress"], ["PATCH", "progress"], ["DELETE", "progress"], ["PUT", "tests"]]) {
  const w = await call(`/api/mentor/students/CP-2026-00042/${p}`, { method: m, token, body: { data: { hacked: true } } });
  check(`${m} /${p} is not a route`, w.status === 404 || w.status === 405, `-> ${w.status}`);
}
const after = await MentorProgress.findOne({ email: "mine@example.com" }).lean();
check("student's data unchanged on disk", after.data.hacked === undefined && after.data.entries.length === 1);

console.log("\nadmin revoke kills live sessions\n");
await call(`/api/admin/mentors/${mentorId}`, { method: "PATCH", admin: ADMIN, body: { active: false } });
const revoked = await call("/api/mentor/students", { token });
check("revoked mentor's live token stops working", revoked.status === 403 || revoked.status === 401, `-> ${revoked.status}`);

console.log(fail ? `\n${fail} FAILURE(S)` : "\nALL PASSED");
await mongoose.disconnect();
await mem.stop();
srv.close();
process.exitCode = fail ? 1 : 0;
