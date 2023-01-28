import {Router} from "express";
import {login, verify, get, getFile} from "./controller.js";

const router = Router()


router.post('/login', (req, res) => login(req, res));

router.post('/verify', (req, res) => verify(req, res));

router.post('/get', (req, res) => get(req, res));

router.get('/getFile', (req, res) => getFile(req, res));
export default router