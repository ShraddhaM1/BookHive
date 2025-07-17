const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const deleteAllBooks = async () => {
  try {
    const snapshot = await db.collection("books").get();

    if (snapshot.empty) {
      console.log("🟢 No books to delete. Collection is already empty.");
      return;
    }

    const batchSize = 500;
    let batchCount = 0;

    const deleteBatch = async (docs) => {
      const batch = db.batch();
      docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
    };

    const chunks = [];
    for (let i = 0; i < snapshot.docs.length; i += batchSize) {
      chunks.push(snapshot.docs.slice(i, i + batchSize));
    }

    for (const chunk of chunks) {
      await deleteBatch(chunk);
      batchCount += 1;
      console.log(`🗑️ Deleted batch ${batchCount} of ${chunks.length}`);
    }

    console.log("✅ All books deleted successfully!");
  } catch (error) {
    console.error("❌ Error deleting books:", error);
  }
};

deleteAllBooks();
