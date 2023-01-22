const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res, next) => {
	res.status(200).json({ message: "Hello Everyone 👋" });
});

module.exports = app;
