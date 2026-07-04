const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require("http");
const connectDB = require("./config/db");

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
const version = process.env.CURRENT_VERSION;

app.use(`/api/${version}/auth`, require(`./routes/${version}/authRoute`));
app.use(`/api/${version}/user`, require(`./routes/${version}/userRoute`));
app.use(`/api/${version}/admin`, require(`./routes/${version}/adminRoute`));
app.use(`/api/${version}/admin`, require(`./routes/${version}/merchantRoute`));
app.use(`/api/${version}/admin/role-permission`, require(`./routes/${version}/rolePermissionRoute.js`));
app.use(`/api/${version}/payIn`, require(`./routes/${version}/payInRoute.js`));
const swaggerRoute = require(`./routes/${version}/swaggerRoute`);
app.use("/api-docs", swaggerRoute);

// Start Server
const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 5000;
        let server;
        server = http.createServer(app);
        server.listen(PORT, () => {
            console.log(
                `${
                    process.env.NODE_ENV === "production" ? "Secure" : "Dev"
                } server running at ${
                    process.env.NODE_ENV === "production"
                        ? `https://upfinzo.com:${PORT}`
                        : `http://localhost:${PORT}`
                }`
            );
        });
    } catch (err) {
        console.error("Failed to start server:", err.message);
        process.exit(1);
    }
};

startServer()
    .then(()=>{
        console.log('Server started successfully')
    })
    .catch((error)=>{
        console.log('Error while starting the server: '+ error);
    });