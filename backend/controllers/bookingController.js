import Booking from "../models/Booking.js";

export const createBooking = async (req, res) => {
    const newBooking = new Booking(req.body);

    try {
        const savedBooking = await newBooking.save(); // Add 'await' here

        res.status(200).json({
            success: true,
            message: "Booking Completed",
            data: savedBooking,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const getBooking = async (req, res) => {
    const id = req.params.id;

    try {
        const booking = await Booking.findById(id);
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Booking retrieved successfully",
            data: booking,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const getAllBooking = async (req, res) => {
    try {
        const bookings = await Booking.find();

        res.status(200).json({
            success: true,
            message: "All bookings retrieved successfully",
            data: bookings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
