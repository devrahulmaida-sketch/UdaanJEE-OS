import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const port = Number(process.env.PORT || 4004);
const serviceDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(serviceDir, "../../..");

const studentProfiles = JSON.parse(
  readFileSync(resolve(rootDir, "data/student-profiles.demo.json"), "utf-8")
);

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

function linearTrend(values) {
  if (values.length < 2) {
    return 0;
  }
  return Number((values[values.length - 1] - values[0]).toFixed(2));
}

function buildInterventions(student) {
  const interventions = [];

  if (student.backlogHours >= 8) {
    interventions.push({
      type: "backlog",
      priority: "high",
      action: "Allocate 1.5h/day backlog recovery for next 7 days"
    });
  }

  if (student.burnoutRisk >= 0.6) {
    interventions.push({
      type: "wellbeing",
      priority: "high",
      action: "Reduce daily load by 1 hour and enforce sleep minimum 7h"
    });
  }

  if ((student.weakTopics || []).length > 0) {
    interventions.push({
      type: "academic",
      priority: "medium",
      action: `Run focused revision loops on: ${student.weakTopics.join(", ")}`
    });
  }

  return interventions;
}

const server = createServer((req, res) => {
  const method = req.method || "GET";
  const url = new URL(req.url || "/", `http://localhost:${port}`);

  if (method === "GET" && url.pathname === "/health") {
    sendJson(res, 200, { service: "analytics-service", status: "ok" });
    return;
  }

  const perfMatch = url.pathname.match(/^\/v1\/students\/([^/]+)\/performance$/);
  if (method === "GET" && perfMatch) {
    const studentId = perfMatch[1];
    const student = studentProfiles.students.find((item) => item.studentId === studentId);
    if (!student) {
      sendJson(res, 404, { error: { code: "student_not_found", message: "Student not found" } });
      return;
    }

    const scores = (student.testHistory || []).map((t) => t.score);
    const latest = scores[scores.length - 1] || 0;

    sendJson(res, 200, {
      studentId,
      latestScore: latest,
      trendDelta: linearTrend(scores),
      backlogHours: student.backlogHours,
      burnoutRisk: student.burnoutRisk,
      weakTopics: student.weakTopics
    });
    return;
  }

  const interventionMatch = url.pathname.match(/^\/v1\/students\/([^/]+)\/interventions$/);
  if (method === "GET" && interventionMatch) {
    const studentId = interventionMatch[1];
    const student = studentProfiles.students.find((item) => item.studentId === studentId);
    if (!student) {
      sendJson(res, 404, { error: { code: "student_not_found", message: "Student not found" } });
      return;
    }

    sendJson(res, 200, {
      studentId,
      interventions: buildInterventions(student)
    });
    return;
  }

  sendJson(res, 404, {
    error: { code: "not_found", message: "Route not found" }
  });
});

server.listen(port, () => {
  console.log(`analytics-service listening on :${port}`);
});
