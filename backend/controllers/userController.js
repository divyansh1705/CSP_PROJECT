import User from "../models/User.js"; 

export const createUser = async (req, res) => {
    const newUser = new User(req.body); 

    try {
        const savedUser = await newUser.save(); 
        res.status(200).json({ success: true, message: "Successfully Created", data: savedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to create, try again" });
    }
};

export const updateUser = async (req, res) => {
    const id = req.params.id;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, {
            $set: req.body,
        }, { new: true });

        res.status(200).json({ success: true, message: "Successfully Updated", data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update, try again" });
    }
};

export const deleteUser = async (req, res) => {
    const id = req.params.id;

    try {
        await User.findByIdAndDelete(id); 
        res.status(200).json({ success: true, message: "Successfully Deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete, try again" });
    }
};

export const getSingleUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id); 
        if (user) {
            res.status(200).json({ success: true, message: "Successful", data: user });
        } else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to retrieve the user" });
    }
};

export const getAllUser = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ success: true, message: "Successful", data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch users" });
    }
};
