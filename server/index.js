require('dotenv').config();
const express = require('express');
const firebase = require('firebase');
require('firebase/auth');

const app = express();

app.use(express.json(), express.urlencoded({extended: true}));

let firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "game-19976.firebaseapp.com",
    databaseURL: "https://game-19976.firebaseio.com",
    projectId: "game-19976",
    storageBucket: "game-19976.appspot.com",
    messagingSenderId: "681528383181",
    appId: "1:681528383181:web:4af21892d553f1e860bb84",
    measurementId: "G-1X0LBFZ12D"
  };
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

app.post('/server/authenticate',async (req,res) => {
  let{email, password} = req.body;

  try{
    await auth.signInWithEmailAndPassword(`${email}`,`${password}`);
    console.log('successfully signed in');

  }catch(error){
    try{
      await auth.createUserWithEmailAndPassword(`${email}`,`${password}`);
      console.log('successfully signed up');
    }catch(error){
      console.log(error.message);
    }
  }

});

app.delete('/server/signout',async (req, res) => {
  try{
    auth.signOut();
    console.log('successfully signed out');

  }catch(error){
    console.log(error.message);
  }

});






app.listen(5000, () => {
  console.log('server started on port 5000')
});
