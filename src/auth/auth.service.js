// import database connection pool
import pool from "../config/db.js";

// import bcrypt for hashing and verifying of passwords
import bcrypt from "bcryptjs";

//import the token generator
import { generateToken } from "../config/jwt.js";

// import AppError
import AppError from "../middleware/AppError.js";

// signup service
export const signupService = async ({ email, password, company_name, country }) => {
    // check if the user with the email exists
    const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
    );

    // if user exists
    if (existingUser.rows.length > 0) {
        throw new AppError('Email already in use', 409);
    }

    // hash the password
    const password_hash = await bcrypt.hash(password, 12);

    // insert the new user into the database
    const result = await pool.query(
        `INSERT INTO users (email, password_hash, company_name, country)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, company_name, country, created_at`,
        [email, password_hash, company_name, country]
    );

    // Get the newly created user from the result
    const user = result.rows[0];

    // generate a token for the user
    const token = generateToken({id: user.id, email: user.email });

    // return the user data and token
    return { user, token}
};

// login service
export const loginService = async({ email, password }) => {
    // find user by email
    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );
    
    const user = result.rows[0];
    // if no user was found
    if (!user) {
        throw new AppError('Invalid email or password', 401);
    }

    // compared the password to the hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    // if password does not match
    if (!isMatch) {
        throw new AppError('Invalid email or password', 401);
    }

    // generate a token
    const token = generateToken({ id: user.id, email: user.email });

    // return user data with the hashed password
    const { password_hash, ...safeUser } = user;
    return { user: safeUser, token };
};

// GET ME SERVICE
// Returns the logged in user's data
export const getMeService = async (userId) => {
    // find the user by id
    const result = await pool.query(
        'SELECT id, email, company_name, country, created_at FROM users WHERE id = $1',
        [userId]
    );

    const user = result.rows[0];
    // if user was not found
    if (!user) {
        throw new AppError('User not found', 404);
    }

    return user;
}