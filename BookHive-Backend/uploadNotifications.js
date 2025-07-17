const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ✅ Path to your notifications JSON file
const filePath = path.join(__dirname, "notifications.json");
const notifications = JSON.parse(fs.readFileSync(filePath, "utf8")).notifications;

const uploadNotifications = async () => {
  console.log("🚀 Upload starting...");
  let uploaded = 0;
  let skipped = 0;

  for (let notification of notifications) {
    try {
      // Basic sanity check
      if (!notification.message) {
        console.warn(`⚠️ Skipped (Missing message): ${JSON.stringify(notification)}`);
        skipped++;
        continue;
      }

      // Upload to Firestore
      await db.collection("notifications").add({
        message: notification.message,
        type: notification.type ?? "general",
        attachedBook: notification.attachedBook ?? null, // You can later attach book IDs here
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      uploaded++;
      console.log(`✅ Uploaded notification: ${notification.message.substring(0, 30)}...`);
    } catch (error) {
      console.error(`❌ Error uploading notification:`, error);
    }
  }

  console.log(`\n🎉 Notification upload complete!`);
  console.log(`📬 Total Notifications Processed: ${notifications.length}`);
  console.log(`✅ Uploaded: ${uploaded}`);
  console.log(`⚠️ Skipped: ${skipped}`);
};

uploadNotifications();
