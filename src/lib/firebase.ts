import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAWtByMo5E7Pj3cNMHP738UkTor4pq-7K4",
  authDomain: "collectorshub-6814e.firebaseapp.com",
  projectId: "collectorshub-6814e",
  storageBucket: "collectorshub-6814e.firebasestorage.app",
  messagingSenderId: "244237574953",
  appId: "1:244237574953:web:c80f68e9e1a38d480b4d38",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
