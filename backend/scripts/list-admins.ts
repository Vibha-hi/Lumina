import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env") });
import User from "../src/models/User.js";

async function listAdmins() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not set in backend/.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    const admins = await User.find({ role: "admin" }).select("name email createdAt").lean();
    
    if (admins.length === 0) {
      console.log("No admins found in the database.");
    } else {
      console.log(`\nFound ${admins.length} admin(s):`);
      console.log("-".repeat(40));
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.name} (${admin.email})`);
        console.log(`   Created: ${admin.createdAt}`);
      });
      console.log("-".repeat(40) + "\n");
    }
  } catch (error) {
    console.error("❌ Error fetching admins:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

listAdmins();
