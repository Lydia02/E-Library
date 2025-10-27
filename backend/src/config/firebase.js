import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccountPath = join(__dirname, '../../serviceAccountKey.json');

if (!existsSync(serviceAccountPath)) {
  console.error('❌ ERROR: serviceAccountKey.json not found!');
  console.error('📍 Expected location:', serviceAccountPath);
  console.error('\n📝 To fix this:');
  console.error('1. Go to Firebase Console: https://console.firebase.google.com');
  console.error('2. Select your project');
  console.error('3. Go to Project Settings → Service Accounts');
  console.error('4. Click "Generate new private key"');
  console.error('5. Save the file as "serviceAccountKey.json" in the backend folder\n');
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

const db = admin.firestore();
const auth = admin.auth();

console.log('✅ Firebase Admin SDK initialized');
console.log('🔥 Project ID:', process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id);

export { admin, db, auth };
