// import the configured express app
import app from './src/app.js';

const PORT = process.env.PORT || 3000;

// start the server
app.listen(PORT, () => {
    console.log(`Helios Server running on port ${PORT}`);
});