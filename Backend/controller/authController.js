import User from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import { genToken } from "../config/token.js";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Enter a valid email address" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Enter strong password with minimum 8 characters" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = await genToken(newUser._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json(newUser);

    } catch (error) {
        console.log("Registration error:", error);
        return res.status(500).json({ message: `Registration error: ${error.message}` });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Agar user Google se bana tha toh password nahi hoga
        if (!user.password) {
            return res.status(400).json({ message: "This account uses Google Sign-In. Please login with Google." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect Password" });
        }

        const token = await genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json(user);

    } catch (error) {
        console.log("Login error:", error);
        return res.status(500).json({ message: `Login error: ${error.message}` });
    }
};

export const googleAuth = async (req, res) => {
    try {
        const { name, email } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
            });
        }

        const token = await genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json(user);

    } catch (error) {
        console.log("Google Auth error:", error);
        return res.status(500).json({ message: `Google Auth error: ${error.message}` });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        });
        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.log("Logout error:", error);
        return res.status(500).json({ message: `Logout error: ${error.message}` });
    }
};