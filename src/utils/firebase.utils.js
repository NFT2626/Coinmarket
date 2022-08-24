import {initializeApp} from 'firebase/app'
import { getAuth,signInWithPopup,signInWithRedirect,GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCtUiO-2Df0y_KNtDd_N_MuCafRYsef5kw",
    authDomain: "coinmarket-db.firebaseapp.com",
    projectId: "coinmarket-db",
    storageBucket: "coinmarket-db.appspot.com",
    messagingSenderId: "947163167091",
    appId: "1:947163167091:web:e9ab7e0636671d2671ad06"
  }
  
  const app = initializeApp(firebaseConfig)

  const provider = new GoogleAuthProvider()

  provider.setCustomParameters({
    prompt:"select_account"
  })

  export const auth = getAuth()
  export const signInWithGooglePopup = () => signInWithPopup(auth,provider)
