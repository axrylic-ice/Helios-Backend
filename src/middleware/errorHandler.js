// centralized error handler
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    const message = err.message || 'Something went wrong';

    if (err.isOperational) {
        return res.status(statusCode).json({
            status: 'error',
            message,
        });
    }

    // if it is a programming error
    console.error('UNEXPECTED ERROR:', err);

    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong. Please try again later',
    });
};

export default errorHandler;