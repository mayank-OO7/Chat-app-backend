import { RequestHandler, Router } from "express";
import "../../../../di/provideDependencices";
import { CreateUserController } from "../controller/CreateUserController";
import { SignInController } from "../controller/SignInUserController";
import { authMiddleware } from "../../../common/utils/jwtUtils";
const router = Router();

router.post("/signup", new CreateUserController().createUserHandler);

router.post("/signin", new SignInController().signInHandler);

router.post("/", authMiddleware, (req, res, next) => {
  return res.status(200).json({ success: true });
});

export default router;
