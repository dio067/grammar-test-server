import express from "express";
import cors from "cors";
import fs from "fs";

const path = require("path");

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "build")));

// Anything that doesn't match an API route, send back React index.html
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "build", "index.html"));
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const questions = JSON.parse(
	fs.readFileSync("questions.json", "utf8")
).questions;

// Endpoints
app.get("/api/questions", (req, res) => {
	const shuffled = questions.sort(() => 0.5 - Math.random());
	const selectedQuestions = shuffled.slice(0, 10).map((q) => {
		return {
			id: q.id,
			question: q.question,
			options: q.options,
		};
	});
	res.json(selectedQuestions);
});

app.post("/api/answer", (req, res) => {
	const { id, userAnswer } = req.body;
	const question = questions.find((q) => q.id === id);

	if (!question) {
		return res
			.status(404)
			.json({ correct: false, message: "Question not found" });
	}

	const correct = question.answer.trim() === userAnswer.trim();
	res.json({ correct });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
