// import jsonwebtoken library
import jwt from 'jsonwebtoken';

// Generate a JWT token for a user after login or signup
export const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// Verify a token and return the decoded data
export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};