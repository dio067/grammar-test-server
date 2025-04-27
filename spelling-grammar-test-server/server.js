import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "build")));

// API Endpoints without parameters
app.use(cors());
app.use(express.json());

const questions = JSON.parse(
	fs.readFileSync("questions.json", "utf8")
).questions;

// Get all questions (no parameter)
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

// Submit answer (no parameter)
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

// React index.html as fallback for unhandled routes
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
