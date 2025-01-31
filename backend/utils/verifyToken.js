import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Access Denied. No token provided." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: "Invalid or expired token." });
    }
};

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, (error) => {
        if (error) return;

        if (req.user.id === req.params.id || req.user.role === "user" || req.user.role === "admin") {
            next();
        } else {
            return res.status(401).json({ success: false, message: "You are not authenticated." });
        }
    });
};

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, (error) => {
        if (error) return;

        if (req.user.role === "admin") {
            next();
        } else {
            return res.status(403).json({ success: false, message: "You are not authorized." });
        }
    });
};
