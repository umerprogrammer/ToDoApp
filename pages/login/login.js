import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import { getDatabase} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAuth,signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

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



window.loginUser = function(e){
    e.preventDefault();

    const userEmail = document.getElementById("email").value;
    const userPassword = document.getElementById("password").value;

    console.log(userEmail,userPassword);

    // Signed in
    signInWithEmailAndPassword(auth,userEmail,userPassword).then((userCredential) => {
        
        const user = userCredential.user;
        console.log('Logged in as:', user.email);
        localStorage.setItem("userDetails",JSON.stringify(userCredential.user));
        window.location.assign("../addtodo/addtodo.html");
        
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage);
    });
}