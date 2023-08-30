import { Router } from "express";
import { agencyGet, agencyPost, agencyPut, agencyDelete  } from "../controllers/Agency.js"
const router = Router();

//rutas
router.get('/', agencyGet);

router.post('/', agencyPost);

router.put('/:id', agencyPut);

router.delete('/:id', agencyDelete);


export {router as routerAgency};