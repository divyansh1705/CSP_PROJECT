import Tour from "../models/Tour.js";

export const createTour = async (req, res) => {
    const newTour = new Tour(req.body);

    try {
        const savedTour = await newTour.save();
        res.status(200).json({ success: true, message: "Successfully Created", data: savedTour });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to create, try again" });
    }
};

export const updateTour = async (req, res) => {
    const id = req.params.id;

    try {
        const updatedTour = await Tour.findByIdAndUpdate(id, {
            $set: req.body,
        }, { new: true });

        res.status(200).json({ success: true, message: "Successfully Updated", data: updatedTour });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update, try again" });
    }
};

export const deleteTour = async (req, res) => {
    const id = req.params.id;

    try {
        await Tour.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Successfully Deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete, try again" });
    }
};

export const getSingleTour = async (req, res) => {
    const id = req.params.id;
    
    try {
        const tour = await Tour.findById(id).populate('reviews');

        if (tour) {
            res.status(200).json({ success: true, message: "Successful", data: tour });
        } else {
            res.status(404).json({ success: false, message: "Tour not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to retrieve the tour" });
    }
};

export const getAllTour = async (req, res) => {

    const page=parseInt(req.query.page)

    try {
        const tours = await Tour.find({}).populate('reviews')
        .skip(page * 8)
        .limit(8);

        res.status(200).json({ success: true,count:tours.length ,message: "Successful", data: tours });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch tours" });
    }
};

export const getTourBySearch =async(req,res)=>{

    const city=new RegExp(req.query.city)
    // const city=req.query.city
    const maxGroupSize=parseInt(req.query.maxGroupSize)
    const distance=parseInt(req.query.distance)
    console.log(city)

    try {
        const tour=await Tour.find({
            city,
            distance:{$gte : distance},
            maxGroupSize: {$gte : maxGroupSize},
        }).populate('reviews');
        console.log(tour)

        res.status(200).json({success: true,message: "Successful", data: tour})
    } catch (error) {
        res.status(404).json({success: false,message: "Not found"})
    }
}

export const getFeaturedTour = async (req, res) => {

    try {
        const tours = await Tour.find({featured:true})
        .populate('reviews')
        .limit(8);
        res.status(200).json({ success: true,message: "Successful", data: tours });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch tours" });
    }
};

export const getTourCount = async(req,res)=>{
    try {
        const TourCount=await Tour.estimatedDocumentCount()
        res.status(200).json({success:true,data:TourCount})
    } catch (error) {
        res.status(500).json({success:false,message:'Failed to fetch'})
    }
}
