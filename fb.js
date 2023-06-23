/**
 * Configuração do Firebase
 * By Luferat
 * MIT License 
 **/

/**
 * Configurações so Firebase
 * 
 * IMPORTANTE!
 * Troque os valores de 'firebaseConfig' pelos dados do SEU FIREBASE!
 **/
const firebaseConfig = {
    apiKey: "AIzaSyBp6N79lnnwcicHyJzxzvfUcy3biVF9chQ",
    authDomain: "frontendeiros-25959.firebaseapp.com",
    projectId: "frontendeiros-25959",
    storageBucket: "frontendeiros-25959.appspot.com",
    messagingSenderId: "315772714963",
    appId: "1:315772714963:web:313afe5b5a41f1baa7b926"
};

// Incializa o Firebase
firebase.initializeApp(firebaseConfig);

// Incializa o Firebase Authentication
const auth = firebase.auth();

// Define o provedor de autenticação
var provider = new firebase.auth.GoogleAuthProvider();