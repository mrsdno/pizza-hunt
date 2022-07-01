// create variable to hold the database connection
let db;

// esablish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1
const request = indexedDB.open("pizza_hunt", 1);

// this event will emit if the database version changes

request.onupgradeneeded = function (event) {
  // save a reference to the database
  const db = event.target.result;

  // create an object store (table) called new_pizza, set it to have an auto incrementing primary key of sorts
  db.createObjectStore("new_pizza", { autoIncrement: true });
};

request.onsuccess = function (event) {
  // when db is successfully created with its object sotre (from event above) or simply established, save reference to db in global variable
  db = event.target.result;

  if (navigator.onLine) {
    uploadPizza();
  }
};

request.onerror = function (event) {
  console.log(event.target.errorCode);
};

// this function will execute if we try to save with no internet
function saveRecord(record) {
  // open a new transaction with the database with read and write permissions
  const transaction = db.transaction(["new_pizza"], "readwrite");

  // access the object store for `new_pizza`
  const pizzaObjectStore = transaction.objectStore("new_pizza");

  // add record to your store with add method
  pizzaObjectStore.add(record);
}

function uploadPizza() {
  // open a transaction on your db
  const transaction = db.transaction(["new_pizza"], "readwrite");

  // access your object store
  const pizzaObjectStore = transaction.objectStore("new_pizza");

  // get all records from store and set to a variable
  const getAll = pizzaObjectStore.getAll();

  // upon a successful .getAll() execution, run this function
  getAll.onsuccess = function () {
    // if there was data in indexedDb's store, let's send it to the api server
    if (getAll.result.length > 0) {
      fetch("/api/pizzas", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          // open one more transaction
          const transaction = db.transaction(["new_pizza"], "readwrite");
          // access the new_pizza object store
          const pizzaObjectStore = transaction.objectStore("new_pizza");
          // clear all items in your store
          pizzaObjectStore.clear();

          alert("All saved pizza has been submitted!");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

// listen for app coming back online
window.addEventListener('online', uploadPizza);