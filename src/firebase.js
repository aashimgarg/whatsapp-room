import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyA0klZwKThDf2zI1KW7csLsMtrdK3OGSls",
    authDomain: "whatsapp-room-34f20.firebaseapp.com",
    databaseURL: "https://whatsapp-room-34f20.firebaseio.com",
    projectId: "whatsapp-room-34f20",
    storageBucket: "whatsapp-room-34f20.appspot.com",
    messagingSenderId: "671367607981",
    appId: "1:671367607981:web:688e164c3e3005966d7824",
    measurementId: "G-9WQ5MLCMDX"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  export { auth , provider };
  export default db;