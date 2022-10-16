import {Router} from "express";
import * as authController from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/', verifyToken, authController.checkAuth);
export default router;