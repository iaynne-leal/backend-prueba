import { Router } from "express";
import { scheduleGet, schedulePost, schedulePut, scheduleDelete  } from "../controllers/Schedule.js"
const router = Router();

//rutas
router.get('/', scheduleGet); 

router.post('/', schedulePost);

router.put('/:id', schedulePut);

router.delete('/:id', scheduleDelete);


export {router as routerSchedule};