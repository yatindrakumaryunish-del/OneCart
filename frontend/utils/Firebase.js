import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "loginonecart-6fa9c.firebaseapp.com",
  projectId: "loginonecart-6fa9c",
  storageBucket: "loginonecart-6fa9c.firebasestorage.app",
  messagingSenderId: "676022362306",
  appId: "1:676022362306:web:f53964819955c52d30db5b"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()



export {auth , provider}
