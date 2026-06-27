import mongoose from 'mongoose';
import Test from './models/Test.js';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const test = await Test.findOne().sort({ createdAt: -1 }).lean();
  if (test) {
    const q41 = test.questions.find(q => q.qno === 41);
    console.log("Q41 Data:", JSON.stringify(q41, null, 2));
  } else {
    console.log("No tests found");
  }
  process.exit(0);
}
run();
