import User from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import { genToken } from "./token.js";

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

        // Variable ka naam newUser rakha hai taaki Model 'User' se clash na ho
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

        // Seedha user object return karo (jaise register me kiya tha):
        return res.status(200).json(user);

    } catch (error) {
        console.log("Login error:", error);
        return res.status(500).json({ message: `Login error: ${error.message}` });
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
}