// Custom error class that extends the built in Error class
// It adds a statusCode so we can return the correct HTTP response
class AppError extends Error {
    constructor (message, statusCode) {
        // Call the parent Error class with the message
        super(message);

        // Attach the status code to this error
        this.statusCode = statusCode;

        // mark it as an operational bug
        this.isOperational = true;
    }
}

export default AppError;