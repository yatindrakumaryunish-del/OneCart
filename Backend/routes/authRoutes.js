import express from "express";
import { register } from "../controller/authController.js";
import { login } from "../controller/authController.js";
import { logout } from "../controller/authController.js";

const authRoutes = express.Router();

authRoutes.post("/registration", register);
authRoutes.post("/login", login);
authRoutes.get("/logout", logout);

export default authRoutes;