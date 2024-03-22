import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import { getDatabase, onValue, remove, set, get, ref, push, update, onChildAdded } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

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

var todoId = document.getElementById("todoId");
var txttodo = document.getElementById("txttodo");
var userId = document.getElementById("userId");
var logOut = document.getElementById("logout");




const user = JSON.parse(localStorage.getItem("userDetails"));
userId.innerHTML = user.email;

if (user != null)
    logOut.style.display = "block";
else
    logOut.style.display = "none";

var todoObj = {
    todoDate: "",
    todos: [],
    todoStatus: ""
};


window.logout = function () {
    localStorage.removeItem("userDetails");
    window.location.replace('../login/login.html');
}

window.addNewTodo = async function (e) {
    e.preventDefault();
    var reference;
    var todo;

    let dataRef = ref(db, `mytodo/${user.uid}`);
    var data = [];


    data = await getData(dataRef);
    var fetchData = data != null ? data.filter(f => f.todoDate == (new Date()).toLocaleDateString() && f.uid == user.uid) : null;
    console.log(fetchData, "filter");

    if (data == null || fetchData == null || fetchData.length == 0) {
        console.log("NEW", "RECORD");
        todoObj.uid = `${user.uid}`;
        todoObj.id = push(ref(db, `mytodo/`)).key;
        reference = ref(db, `mytodo/${todoObj.uid}/${todoObj.id}`);
        const d = new Date();
        todoObj.todoDate = d.toLocaleDateString();
        todoObj.todoStatus = "Pending";
        todoObj.todos = [];
        todo = {
            id : 0,
            description: txttodo.value,
            todotime: new Date().toTimeString(),
        }
        todoObj.todos.push(todo);
        set(reference, todoObj);
    }
    else {
        fetchData.forEach(element => {
            if (element != null) {
                element.todos = Object.values(element.todos);
                todo = {
                    id : element.todos.length,
                    description: txttodo.value,
                    todotime: new Date().toTimeString(),
                }
                element.todos.push(todo);
                console.log(element, "Udpate RECORD");
                var updReference = ref(db, `mytodo/${element.uid}/${element.id}`);
                update(updReference, element)
                    .then(() => {

                        console.log("Data updated successfully");
                    })
                    .catch((error) => {
                        console.error("Error updating data:", error);
                    });
            }
        });
    }
    getAllData();

}


async function getAllData() {
    let dataRef = ref(db, `mytodo/${user.uid}`);
    var data = [];

    data = await getData(dataRef);
    console.log(data, "Get All Data");
    const body = document.getElementById("gridBody");
    body.innerHTML = "";
    var i = 0;

    data.forEach(element => {
        var index = 0;
        console.log(element.todos, "data get");
        element.todos = Object.values(element.todos);
        element.todos.forEach(todo => {
            console.log(element.todos.findIndex(f => f.description === todo.description && f.todotime === todo.todotime ), "get Index");
            body.innerHTML += `<tr  ondblclick="selectRow(this)">
            <td>
            ${i + 1}
            </td>
            <td>
            ${element.todoDate} 
            </td>
            <td>
            ${todo.description} 
            </td>
            <td>
            ${element.todoStatus}
            </td>
            <td class="d-flex gap-2">
            <button type="button" onclick="deleteTodo('mytodo/${element.uid}/${element.id}',${todo.id})" id="btndelete" class="btn btn-danger">Delete</button> 
            <button type="button" onclick="updateRow('mytodo/${element.uid}/${element.id}',${index})" class="btn btn-warning" id="btnupdate" disabled >Update</button>
            </td>
            </tr>`;
            i++;
            index++;
        });

    });
}

window.deleteAll = function deleteAll() {
    //console.log("data","delete All");
    const deleteAllRef = ref(db, `mytodo/${user.uid}`);
    return new Promise((resolve, reject) => {
        remove(deleteAllRef).then(() => {
            resolve("All data has been deleted.");
            getAllData();
        }).catch((error) => {
            reject(error);
        })
    });
}

async function getData(reference) {
    return new Promise((resolve, reject) => {
        get(reference).then((snapshot) => {
            if (snapshot.exists()) {
                var data = Object.values(snapshot.val());
                resolve(data);
            } else {
                console.log("data,not found");
                resolve(null);
            }
        }).catch((error) => {
            console.error("Error fetching data:", error);
            reject(error);
        })
    });
}


/////////////////// DELETE ROW ///////////////

window.deleteTodo = function (path, id) {
    return new Promise(async (resolve, reject) => {

        let todoRef = ref(db, path + "/todos");
        var data = [];
        var pathRef = "";

        data = await getData(todoRef);
        if (data.length > 1)
            pathRef = path + "/todos/" + id;
        else
            pathRef = path;
        
        const refDeleteTodo = ref(db, pathRef);
        remove(refDeleteTodo).then(() => {
            resolve("Data has been deleted.");
            getAllData();
        }).catch((error) => {
            reject(error);
        })
    });
}


/////////////////// SELECT ROW ///////////////

window.selectRow = function (data) {
    var btnupdate = data.lastElementChild.lastElementChild;
    data.parentNode.childNodes.forEach(element => {
        element.classList.remove("bg-info");
        element.cells[4].lastElementChild.disabled = true;
    })
    data.className = "bg-info";
    btnupdate.disabled = false;
    txttodo.value = data.cells[2].innerText;
    todoId.innerText = data.cells[0].innerText;

}



/////////////////// UPDATE DATA ///////////////

window.updateRow = function (path, id) {
    var todo;
    todo = {
        description: txttodo.value,
       
    }
    // todotime: new Date().toTimeString(),
    console.log(todo, "TODO");
    var updReference = ref(db, path + "/todos/" + id);
    update(updReference, todo)
        .then(() => {

            console.log("Data updated successfully");
            getAllData();
        })
        .catch((error) => {
            console.error("Error updating data:", error);
        });

}


getAllData();



// get(dataRef).then((snapshot) =>{
//     if(snapshot.exists()){
//         data = Object.values( snapshot.val());
//         console.log(data,"data");
//     }
//     else{
//         }
// }).catch((error)=>{
//     console.error("Error fetching data:", error);
// })
// console.log(data,"Data2" );