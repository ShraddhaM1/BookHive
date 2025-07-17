// Import Firestore function
import { getFirestore } from "firebase/firestore";

// Import the initialized Firebase app
import app from "./firebaseConfig";

// Create Firestore database instance
const db = getFirestore(app);

// Export the database for use in your app
export default db;
