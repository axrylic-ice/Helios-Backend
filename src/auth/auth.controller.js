import { signupService, loginService, getMeService } from "./auth.service.js";

// signup controller
export const signup = async (req, res, next) => {
    try {
        // extract teh user's data 
        const { email, password, company_name, country } = req.body;

        // pass the data to the signup controller
        const { user, token } = await signupService({email, password, company_name, country});

        // send response
        res.status(201).json({
            status: 'success',
            token,
            data: {user},
        });
    } catch (err) {
        // if something went wrong, pass the error to the error handler
        next(err);
    }
};

// Login controller
export const login = async (req, res, next) => {
    try {
        // extract email and password from the request's body
        const { email, password } = req.body;

        // pass to the login service
        const { user, token } = await loginService({email, password});

        // send the response
        res.status(200).json({
            status: 'success',
            token,
            data: {user},
        });
    } catch (err) {
        next(err);
    }
};

// get me controller
export const getMe = async (req, res, next) => {
    try {
        // req.user is attached by the JWT middleware after verifying the token
        const user = getMeService(req.user.id);

        //send response
        res.status(200).json({
            status: 'success',
            data: {user},
        });
    } catch (err) {
        next(err);
    }
}
