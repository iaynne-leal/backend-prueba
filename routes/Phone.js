import { Router } from "express";
import { phoneGet, phonePost, phonePut, phoneDelete  } from "../controllers/Phone.js"
const router = Router();

//rutas
router.get('/', phoneGet);

router.post('/', phonePost);

router.put('/:id', phonePut);

router.delete('/:id', phoneDelete);


export {router as routerPhone};