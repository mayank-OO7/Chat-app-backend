import { Router } from "express";
import '../../../../di/provideDependencices.js';
import { CreateUserController } from '../controller/CreateUserController.js';
import { SignInController } from '../controller/SignInUserController.js';
import { authMiddleware } from '../../../common/utils/jwtUtils.js';
const router = Router();
router.post("/signup", new CreateUserController().createUserHandler);
router.post("/signin", new SignInController().signInHandler);
router.post("/", authMiddleware, (req, res, next) => {
    return res.status(200).json({ success: true });
});
export default router;
