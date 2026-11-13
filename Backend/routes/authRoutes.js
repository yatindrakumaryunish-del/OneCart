import express from "express";
import { register, login, logout, googleAuth } from "../controller/authController.js";

const authRoutes = express.Router();

authRoutes.post("/registration", register);
authRoutes.post("/login", login);
authRoutes.post("/google", googleAuth);
authRoutes.get("/logout", logout);

export default authRoutes;