import * as dotenv from "dotenv"
import {CreateToken, VerifyToken} from "./services/tokenController.js";
import MYSQL from "../database/db.js";
import jwt_decode from "jwt-decode";
import * as path from "path";
import fs from "fs"
import dirname from 'es-dirname'
import * as constants from "constants";
dotenv.config()

const login = (request, response) => {
    const username = request.body?.username
    const password = request.body?.password

    if(!username && !password) return response.status(422).json({message: "Ошибка! Обязательные данные отсутствуют."})
    MYSQL.getConnection((err, connection)=>{
        connection.connect((err)=>{
            if(err){
                return response.status(500).json({
                    message: "Ошибка! База данных не подключена."
                })
            }

            connection.query(`SELECT * FROM users WHERE ?`,[{username: username}],(err, res)=>{
                console.log(res||err)
                if(res && res.length>0){
                    let user = res[0]
                    if (password === user.password){
                        if(!VerifyToken(user.token)) {
                            user.token = CreateToken({
                                id: user.id,
                                username: user.username
                            })
                            connection.query(`UPDATE users SET ? WHERE id=${user.id}`, [{token: user.token}])
                            connection.release()
                        }
                        return response.status(200).json({
                            username:  res[0].username,
                            token: user.token,
                            status: true
                        })
                    }
                }
                return response.status(401).json({
                    message: "Ошибка! Данные введены неверно."
                })
            })
        })


    })

}

const verify = (request, response) => {
    try{
        const token = request.headers['authorization'].split(' ')[1]
        MYSQL.getConnection((err, connection)=> {
            connection.connect((err) => {
                if(err){
                    return response.status(500).json({
                        message: "Ошибка! База данных не подключена."
                    })
                }
                connection.query(`SELECT * FROM users WHERE ?`,[{token: token}], (err, res) =>{
                    if(res && res.length>0){
                        let user = res[0]
                        if(VerifyToken(token)){
                            if(!user.role.includes(request.body.required_roles)){
                                return response.status(403).json({message: "Not enough permission to access this page"})
                            }
                            return response.status(200).end()
                        }
                    }
                    return response.status(401).json({message: "Invalid token"})
                })
                connection.release()
            })
        })
    }catch (e) {
        return response.status(401).json({message: "Bad request data"})
    }
}

const find = (request, response) => {

}

const create = (request, response) => {

}

const get = (request, response) =>{
    const {id} = jwt_decode(request.headers['authorization'].split(' ')[1])
    MYSQL.getConnection((err, connection)=> {
        connection.connect((err) => {
            if(err){
                return response.status(500).json({
                    message: "Ошибка! База данных не подключена."
                })
            }
            connection.query("SELECT * FROM orders WHERE ?", [{owner_id: id}], (err, res)=>{
                if(res){
                    response.status(200).json(res)
                }
            })
            connection.release()
        })
    })
}

const checkAccess = (request, response, next ,role) =>{
    try{
        const token = request.headers['authorization'].split(' ')[1]
        MYSQL.query(`SELECT * FROM users WHERE ?`,[{token: token}], (err, res) =>{
            if(res && res.length>0){
                let user = res[0]
                if(VerifyToken(token)){
                    if(!user.role.includes(request.body.required_roles)){
                        return response.status(403).end()
                    }
                    return next()
                }
            }
            return response.status(401).json({message: "Invalid token"})
        })
    }catch (e) {
        return response.status(401).end()
    }
}

const getFile = (request, response) =>{
    const file_id = request?.query?.fileId
    if(file_id !== undefined && request.headers['authorization'].split(' ')[1]) {
        try {
           // const {id} = jwt_decode(request.headers['authorization'].split(' ')[1])
            //if (id === file_id) {
                const dir_path = path.resolve(decodeURIComponent(dirname()), "..", "files", file_id.toString() + '.pdf')
                fs.access(dir_path, constants.F_OK, (err) => {
                    console.log(err)
                    if (err) {
                        return response.status(404).json({message: "File not found"})
                    }
                    return response.download(dir_path)
                })
            // } else {
            //     return response.status(404).end()
            // }
        } catch (er) {
            console.log(er)
            return response.status(404).json({message: "Bad request data"})
        }
    }else {
        return response.status(404).json({message: "Id is not defined"})
    }
}

export {login, find, create, verify, get, getFile, checkAccess}