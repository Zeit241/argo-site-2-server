import express from "express"
import router from "./api/router.js";
import cors from "cors"
const app = express()

app.use(cors({
    credentials: true,
    origin: "*"
}))
app.use(express.json({}))
app.use("/api/", router)


app.listen( ()=>{
    console.log("Server started on PORT 8080")
})


















