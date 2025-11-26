import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccountPath = join(__dirname, '../../serviceAccountKey.json');

if (!existsSync(serviceAccountPath)) {
  logger.error('ERROR: serviceAccountKey.json not found!');
  logger.error('Expected location:', serviceAccountPath);
  logger.error('To fix this:');
  logger.error('1. Go to Firebase Console: https://console.firebase.google.com');
  logger.error('2. Select your project');
  logger.error('3. Go to Project Settings → Service Accounts');
  logger.error('4. Click "Generate new private key"');
  logger.error('5. Save the file as "serviceAccountKey.json" in the backend folder');
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

const db = admin.firestore();
const auth = admin.auth();

logger.info('Firebase Admin SDK initialized');
logger.info('Project ID:', process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id);

export const syncToFirestore = async (collection, docId, data) => {
  try {
    await db.collection(collection).doc(docId).set(data, { merge: true });
    logger.info(`Synced to Firestore: ${collection}/${docId}`);
    return true;
  } catch (error) {
    logger.error(`Failed to sync to Firestore: ${collection}/${docId}`, error.message);
    return false;
  }
};

export const deleteFromFirestore = async (collection, docId) => {
  try {
    await db.collection(collection).doc(docId).delete();
    logger.info(` Deleted from Firestore: ${collection}/${docId}`);
    return true;
  } catch (error) {
    logger.error(` Failed to delete from Firestore: ${collection}/${docId}`, error.message);
    return false;
  }
};

export { admin, db, auth };
