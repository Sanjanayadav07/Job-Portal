// server/fixUsers.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { clerkClient } from "@clerk/clerk-sdk-node";
import User from "./models/User.js"; // path सही रखें

dotenv.config();

// ✅ MongoDB connect (warnings-free)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const fixUsers = async () => {
  try {
    // 1️⃣ Placeholder images replace करना
    const placeholderResult = await User.updateMany(
      { image: { $regex: "placeholder.com" } },
      { $set: { image: "/assets/profile_img.png" } }
    );
    if (placeholderResult.modifiedCount > 0) {
      console.log(`🔧 Replaced ${placeholderResult.modifiedCount} placeholder images.`);
    }

    // 2️⃣ सभी users fetch करना
    const users = await User.find({});
    console.log(`📌 Found ${users.length} users.`);

    if (users.length === 0) {
      console.log("⚠️ No users found to fix.");
      return;
    }

    let updatedCount = 0;

    // 3️⃣ Users update loop
    for (let u of users) {
      let needsUpdate = false;

      // Active set
      if (!u.active) {
        u.active = true;
        needsUpdate = true;
      }

      // Clerk से data fetch
      let clerkUser;
      try {
        clerkUser = await clerkClient.users.getUser(u._id);
      } catch (err) {
        console.log(`⚠️ Clerk user not found for ${u._id}, skipping...`);
        continue;
      }

      // Name fix
      if (!u.name || u.name === "New User" || u.name === "Unnamed User") {
        u.name = clerkUser.fullName || "User";
        needsUpdate = true;
      }

      // Email fix
      if (!u.email || u.email.includes("example.com")) {
        u.email = clerkUser.emailAddresses[0]?.emailAddress || u.email;
        needsUpdate = true;
      }

      // Image fix
      if (!u.image || u.image.includes("placeholder.com")) {
        u.image = clerkUser.imageUrl || "/assets/profile_img.png";
        needsUpdate = true;
      }

      if (needsUpdate) {
        await u.save();
        updatedCount++;
        console.log(`🔧 Fixed user: ${u._id} (${u.name})`);
      }
    }

    console.log(`✅ Total users updated: ${updatedCount}`);
    console.log("✅ All users checked and fixed.");
  } catch (err) {
    console.error("❌ Error fixing users:", err);
  } finally {
    mongoose.connection.close();
  }
};

fixUsers();
