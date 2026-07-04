const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        service: "notification Service",
        status: "Running"
    });
});

app.get("/users", (req, res) => {
    res.json([
        {
            id: 1,
            name: "Muthu"
        }
    ]);
});

const PORT = process.env.PORT || 3008;

app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});