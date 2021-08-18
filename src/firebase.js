import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCwswSqIKYD6UedOcaFfQfPB88VxrLVFsA",
    authDomain: "instagram-clone-58376.firebaseapp.com",
    projectId: "instagram-clone-58376",
    storageBucket: "instagram-clone-58376.appspot.com",
    messagingSenderId: "363117731815",
    appId: "1:363117731815:web:ef7b033b1e5006f4cea742"
  };


firebase.initializeApp(firebaseConfig);
let storage = firebase.storage();

export {storage}
export const auth = firebase.auth()    
export default firebase ;
 
