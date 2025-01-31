import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            photo: req.body.photo,
            role: req.body.role || "user"
        });

        await newUser.save();
        res.status(200).json({ success: true, message: "Successfully Created" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to create" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Destructure sensitive fields and exclude them from the response
        const { password: userPassword, role, ...rest } = user._doc;

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "15d" }
        );

        // Set cookie and send response
        res.cookie("access_token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
        });

        res.status(200).json({
            success: true,
            message: "Successfully Logged in",
            token, 
            data: { ...rest },
            role,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Failed to login" });
    }
};

