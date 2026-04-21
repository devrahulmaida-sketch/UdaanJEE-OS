import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const port = Number(process.env.PORT || 4003);
const serviceDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(serviceDir, "../../..");

const questionBank = JSON.parse(
  readFileSync(resolve(rootDir, "data/question-bank/mock-main-set-01.json"), "utf-8")
);

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolveBody, rejectBody) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1_000_000) {
        rejectBody(new Error("payload_too_large"));
      }
    });
    req.on("end", () => {
      if (!data) {
        resolveBody({});
        return;
      }
      try {
        resolveBody(JSON.parse(data));
      } catch {
        rejectBody(new Error("invalid_json"));
      }
    });
    req.on("error", rejectBody);
  });
}

function scoreAttempt(payload) {
  const answers = payload.answers || {};
  const evaluation = questionBank.questions.map((question) => {
    const given = Number(answers[question.id]);
    const isCorrect = given === question.correctOption;
    return {
      questionId: question.id,
      subject: question.subject,
      chapter: question.chapter,
      difficulty: question.difficulty,
      given,
      correct: question.correctOption,
      isCorrect,
      marks: isCorrect ? 4 : given >= 0 ? -1 : 0
    };
  });

  const total = evaluation.reduce((sum, item) => sum + item.marks, 0);
  const max = questionBank.questions.length * 4;

  const bySubject = evaluation.reduce((acc, item) => {
    const current = acc[item.subject] || { attempted: 0, correct: 0, marks: 0 };
    current.attempted += item.given >= 0 ? 1 : 0;
    current.correct += item.isCorrect ? 1 : 0;
    current.marks += item.marks;
    acc[item.subject] = current;
    return acc;
  }, {});

  return {
    score: total,
    maxScore: max,
    accuracy: Number(
      (
        evaluation.filter((item) => item.given >= 0 && item.isCorrect).length /
        Math.max(1, evaluation.filter((item) => item.given >= 0).length)
      ).toFixed(3)
    ),
    bySubject,
    evaluation
  };
}

function generateMock(payload) {
  const subjects = Array.isArray(payload.subjects)
    ? new Set(payload.subjects)
    : new Set(["Physics", "Chemistry", "Mathematics"]);
  const difficultyCap = Math.max(1, Math.min(5, Number(payload.maxDifficulty) || 5));

  const selected = questionBank.questions
    .filter((q) => subjects.has(q.subject))
    .filter((q) => q.difficulty <= difficultyCap)
    .slice(0, Math.max(1, Number(payload.limit) || 5));

  return {
    generatedAt: new Date().toISOString(),
    totalQuestions: selected.length,
    questions: selected.map((q) => ({
      id: q.id,
      subject: q.subject,
      chapter: q.chapter,
      difficulty: q.difficulty
    }))
  };
}

const server = createServer(async (req, res) => {
  const method = req.method || "GET";
  const url = req.url || "/";

  if (method === "GET" && url === "/health") {
    sendJson(res, 200, { service: "assessment-service", status: "ok" });
    return;
  }

  if (method === "POST" && url === "/v1/tests/score") {
    try {
      const body = await readJsonBody(req);
      sendJson(res, 200, {
        status: "scored",
        result: scoreAttempt(body)
      });
    } catch (error) {
      const statusCode = error.message === "invalid_json" ? 400 : 413;
      sendJson(res, statusCode, {
        error: { code: error.message, message: "Unable to process request" }
      });
    }
    return;
  }

  if (method === "POST" && url === "/v1/tests/generate") {
    try {
      const body = await readJsonBody(req);
      sendJson(res, 200, {
        status: "generated",
        test: generateMock(body)
      });
    } catch (error) {
      const statusCode = error.message === "invalid_json" ? 400 : 413;
      sendJson(res, statusCode, {
        error: { code: error.message, message: "Unable to process request" }
      });
    }
    return;
  }

  sendJson(res, 404, {
    error: { code: "not_found", message: "Route not found" }
  });
});

server.listen(port, () => {
  console.log(`assessment-service listening on :${port}`);
});
