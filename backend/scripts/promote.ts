import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import User from "../src/models/User.js";

// Load environment variables from backend/.env
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function promote() {
  const email = process.argv[2];

  if (!email) {
    console.error("Usage: npx tsx scripts/promote.ts <user-email>");
    process.exit(1);
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("Error: MONGODB_URI is not set in backend/.env");
    process.exit(1);
  }

  try {
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(MONGODB_URI);

    const user = await User.findOne({ email });

    if (!user) {
      console.error(`User not found with email: ${email}`);
      process.exit(1);
    }

    if (user.role === "admin") {
      console.log(`User ${email} is already an admin.`);
    } else {
      user.role = "admin";
      await user.save();
      console.log(`Success! Promoted ${email} to admin.`);
    }
  } catch (error) {
    console.error("Error during promotion:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

promote();
