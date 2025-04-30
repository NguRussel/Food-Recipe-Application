import bcrypt from "bcryptjs";
import User from "../models/user.js"; // Assuming you have a User model defined in models/User.js
import passport from "passport"; // Assuming you have passport configured for authentication

export const  register = async (req, res) => {
    try {
        // Logic to register a user (e.g., save to database)
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const newUser = new User({
            username,
            password: hashedPassword,
            isMfaActive: false, // Default value
        });
        console.log("New user:", newUser);
        await newUser.save(); // Save the user to the database
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Registration failed", error });
    }
};
export const  login = async (req, res) => {
    console.log("The Authenticated user:", req.user);
    res.status(200).json({ message: "Login successful", username: req.user, isMfaActive: req.user.isMfaActive });
    
};
export const  logout = async (req, res) => {};      
export const  reset2FA = async (req, res) => {
  // Logic to reset 2FA
  res.status(200).json({ message: "2FA reset" });
};
export const  verify2FA = async (req, res) => {
  // Logic to verify 2FA code
  res.status(200).json({ message: "2FA verified" });
};
export const  setup2FA = async (req, res) => {
  // Logic to set up 2FA (e.g., generate a QR code)
  res.status(200).json({ message: "2FA setup" });
};
export const authStatus = async (req, res) => {};