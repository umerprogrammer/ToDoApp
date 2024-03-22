import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import { getDatabase} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAuth,createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {

    apiKey: "AIzaSyDQVkCsGpOWgu1l6kaNQFZENM1kd72yFIw",
    authDomain: "todoapp-umer.firebaseapp.com",
    databaseURL: "https://todoapp-umer-default-rtdb.firebaseio.com",
    projectId: "todoapp-umer",
    storageBucket: "todoapp-umer.appspot.com",
    messagingSenderId: "939844192561",
    appId: "1:939844192561:web:18ca89f776d2de9a220810",
    measurementId: "G-9FTRG220FJ"

};


//// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase();
const auth = getAuth();



window.createUser = function(e){
    e.preventDefault();
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    
    console.log(password,email);
    createUserWithEmailAndPassword(auth,email,password) .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log('Signed up as:', user.email);
        //console.log('Signed User:', user);
        // You can redirect the user to another page or perform other actions here
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage);
    });

}