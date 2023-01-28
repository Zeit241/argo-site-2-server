import mysql from "mysql2";
import * as dotenv from "dotenv"
dotenv.config()

const MYSQL = mysql.createConnection({
    host: "195.43.142.151",
    user:  "root",
    database:  "argo",
    password:  "Klimov!Vlad2003"
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