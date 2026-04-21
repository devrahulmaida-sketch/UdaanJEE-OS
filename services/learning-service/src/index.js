import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const port = Number(process.env.PORT || 4002);
const serviceDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(serviceDir, "../../..");

const topicGraph = JSON.parse(
  readFileSync(resolve(rootDir, "data/syllabus/topic-graph.json"), "utf-8")
);
const studentProfiles = JSON.parse(
  readFileSync(resolve(rootDir, "data/student-profiles.demo.json"), "utf-8")
);
const pyqBank = JSON.parse(
  readFileSync(resolve(rootDir, "data/content/pyq-sample.json"), "utf-8")
);
const goalsHabits = JSON.parse(
  readFileSync(resolve(rootDir, "data/content/goals-habits-sample.json"), "utf-8")
);
const calendarData = JSON.parse(
  readFileSync(resolve(rootDir, "data/content/exam-calendar-sample.json"), "utf-8")
);
const coachingSync = JSON.parse(
  readFileSync(resolve(rootDir, "data/content/coaching-sync-sample.json"), "utf-8")
);

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

function getRecommendedTopics(studentId, limit = 3) {
  const student = studentProfiles.students.find((item) => item.studentId === studentId);
  if (!student) {
    return [];
  }

  const completed = new Set(student.completedTopics || []);
  const weak = new Set(student.weakTopics || []);

  const available = topicGraph.topics
    .filter((topic) => !completed.has(topic.id))
    .filter((topic) => (topic.prerequisites || []).every((pre) => completed.has(pre)))
    .map((topic) => {
      const priority = (weak.has(topic.id) ? 5 : 2) + topic.difficulty;
      return { ...topic, priority };
    })
    .sort((a, b) => b.priority - a.priority)
    .slice(0, Math.max(1, Number(limit) || 3));

  return available;
}

const server = createServer((req, res) => {
  const method = req.method || "GET";
  const url = new URL(req.url || "/", `http://localhost:${port}`);

  if (method === "GET" && url.pathname === "/health") {
    sendJson(res, 200, { service: "learning-service", status: "ok" });
    return;
  }

  if (method === "GET" && url.pathname === "/v1/topics") {
    sendJson(res, 200, topicGraph);
    return;
  }

  if (method === "GET" && url.pathname === "/v1/topics/recommended") {
    const studentId = url.searchParams.get("studentId") || "";
    const limit = Number(url.searchParams.get("limit") || 3);
    const recommended = getRecommendedTopics(studentId, limit);
    sendJson(res, 200, {
      studentId,
      recommendedCount: recommended.length,
      recommended
    });
    return;
  }

  if (method === "GET" && url.pathname === "/v1/content/pyq") {
    sendJson(res, 200, pyqBank);
    return;
  }

  if (method === "GET" && url.pathname === "/v1/content/goals-habits") {
    sendJson(res, 200, goalsHabits);
    return;
  }

  if (method === "GET" && url.pathname === "/v1/content/calendar") {
    sendJson(res, 200, calendarData);
    return;
  }

  if (method === "GET" && url.pathname === "/v1/content/coaching-sync") {
    sendJson(res, 200, coachingSync);
    return;
  }

  sendJson(res, 404, {
    error: { code: "not_found", message: "Route not found" }
  });
});

server.listen(port, () => {
  console.log(`learning-service listening on :${port}`);
});
