const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ✅ Path to enriched book data with rent, deposit, and totalRent
const filePath = path.join(__dirname, "real_books_50_enriched.json");
const books = JSON.parse(fs.readFileSync(filePath, "utf8"));

const uploadBooks = async () => {
  console.log("🚀 Upload starting...");
  let uploaded = 0;
  let skipped = 0;

  for (let book of books) {
    try {
      // Basic sanity check
      if (!book.title || !book.author || !book.imageUrl) {
        console.warn(`⚠️ Skipped (Missing data): ${book.title || "Unknown"}`);
        skipped++;
        continue;
      }

      // Upload to Firestore
      await db.collection("books").add({
        title: book.title,
        author: book.author,
        imageUrl: book.imageUrl,
        description: book.description || "No description available.",
        price: book.price ?? 0,
        rent: book.rent ?? 0,
        deposit: book.deposit ?? 100,
        totalRent: book.totalRent ?? (book.rent ?? 0) + (book.deposit ?? 100),
        rating: book.rating ?? 4.0,
        genre: book.genre ?? "Unknown",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      uploaded++;
      console.log(`✅ Uploaded: ${book.title}`);
    } catch (error) {
      console.error(`❌ Error uploading ${book.title}:`, error);
    }
  }

  console.log(`\n🎉 Upload complete!`);
  console.log(`📚 Total Books Processed: ${books.length}`);
  console.log(`✅ Uploaded: ${uploaded}`);
  console.log(`⚠️ Skipped: ${skipped}`);
}

uploadBooks();
