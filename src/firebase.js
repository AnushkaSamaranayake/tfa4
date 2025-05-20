import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB3lZTyLhy9Nru-1DJ9Mt5hHECyKjrRewU",
  authDomain: "sv-project-cdedf.firebaseapp.com",
  projectId: "sv-project-cdedf",
  storageBucket: "sv-project-cdedf.firebasestorage.app",
  messagingSenderId: "435878126708",
  appId: "1:435878126708:web:2eb93686c35efebc999d21"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

