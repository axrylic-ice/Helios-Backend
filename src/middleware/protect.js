import { verifyToken } from "../auth/jwt.js";
import AppError from "./AppError.js";
import pool from "../config/db.js";

// protect middleware
const protect = async (req, res, next) => {
    try {
        // Check if the authorization header exists and starts with 'Bearer'
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new AppError('You are not logged in. Please log in to get access', 401));
        }

        // extract the token from the header
        const token = authHeader.split(' ')[1];

        // verify the token
        const decoded = verifyToken(token);

        // check that the user still exists in the database
        const result = await pool.query(
            'SELECT id, email FROM users WHERE id = $1',
            [decoded.id]
        );

        const user = result.rows[0];

        if (!user) {
            return next(new AppError('The user belonging to this token no longer exits', 401));
        }

        // Attach the user to the request object
        req.user = user;

        next();
    } catch (err) {
        return next(new AppError('Invalid or Expired token.Please log in again', 401));
    }
};

export default protect;