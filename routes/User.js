import { Router } from "express";
import { userGet, userPost, userPut, userDelete  } from "../controllers/User.js"
const router = Router();

//rutas
router.get('/', userGet);

router.post('/', userPost);

router.put('/:id', userPut);

router.delete('/:id', userDelete);


export {router as routerUser};