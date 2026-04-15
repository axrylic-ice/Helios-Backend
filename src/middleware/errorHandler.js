// Catches every error thrown in the app and returns clean JSON

const errorHandler = (err, req, res, next) => {
    console.error(`[Helios Error] ${err.message}`);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
    });
};

export default errorHandler;