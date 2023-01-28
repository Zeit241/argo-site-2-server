import mysql from "mysql2";
import * as dotenv from "dotenv"
dotenv.config()

const MYSQL = mysql.createConnection({
    host: process.env.DB_HOST,
    user:  process.env.DB_USER,
    database:  process.env.DB_NAME,
    password:  process.env.DB_PASS
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