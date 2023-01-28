import mysql from "mysql2";

const MYSQL = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "argo",
    password: "qwerty"
});

MYSQL.connect(function(err){
    if (err) {
        return console.error("Ошибка: " + err.message);
    }
    else{
        console.log("Подключение к серверу MySQL успешно установлено");
    }
});

export default MYSQL