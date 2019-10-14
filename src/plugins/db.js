import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

// Get a Firestore instance
const app = firebase.initializeApp({
  projectId: "malayalam-speech-corpora",
  authDomain: "malayalam-speech-corpora.firebaseapp.com",
  apiKey: "AIzaSyAjrsClBbIobZO7N1J1zrfwTu70Uyd6xNE",
  storageBucket: "malayalam-speech-corpora.appspot.com"
});
export const db = app.firestore();

// Initialize access to Cloud Storage for persisting wav files
const storageService = app.storage();
export const storage = storageService.ref();
