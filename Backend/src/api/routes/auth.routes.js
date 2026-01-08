import router from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";

const authRouter = router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

export default authRouter;
