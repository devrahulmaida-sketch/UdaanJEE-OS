import { createServer } from "node:http";

const port = Number(process.env.PORT || 4001);

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

function buildWeeklyPlan(input) {
  const dailyHours = Math.max(2, Math.min(12, Number(input.dailyHours) || 6));
  const backlogHours = Math.max(0, Number(input.backlogHours) || 0);
  const burnoutRisk = Math.max(0, Math.min(1, Number(input.burnoutRisk) || 0));
  const weakTopics = Array.isArray(input.weakTopics) ? input.weakTopics.slice(0, 6) : [];

  const effectiveHours = burnoutRisk > 0.65 ? Math.max(3, dailyHours - 1) : dailyHours;
  const revisionShare = burnoutRisk > 0.65 ? 0.35 : 0.25;
  const problemShare = 0.4;
  const conceptShare = 1 - revisionShare - problemShare;

  const dayTemplate = {
    conceptLearning: Number((effectiveHours * conceptShare).toFixed(1)),
    problemSolving: Number((effectiveHours * problemShare).toFixed(1)),
    spacedRevision: Number((effectiveHours * revisionShare).toFixed(1)),
    backlogRecovery: Number((Math.min(1.5, backlogHours / 7)).toFixed(1))
  };

  return {
    track: input.track || "balanced",
    effectiveDailyHours: effectiveHours,
    burnoutRisk,
    weeklyFocus: weakTopics,
    dayTemplate,
    checkpoints: [
      "Day 3 accuracy review",
      "Day 5 backlog delta review",
      "Day 7 full performance audit"
    ]
  };
}

const server = createServer(async (req, res) => {
  const method = req.method || "GET";
  const url = req.url || "/";

  if (method === "GET" && url === "/health") {
    sendJson(res, 200, { service: "planner-service", status: "ok" });
    return;
  }

  if (method === "POST" && url === "/v1/plans/generate") {
    try {
      const body = await readJsonBody(req);
      sendJson(res, 200, {
        status: "generated",
        generatedAt: new Date().toISOString(),
        plan: buildWeeklyPlan(body)
      });
    } catch (error) {
      const statusCode = error.message === "invalid_json" ? 400 : 413;
      sendJson(res, statusCode, {
        error: {
          code: error.message,
          message: "Unable to process request"
        }
      });
    }
    return;
  }

  if (method === "POST" && url === "/v1/plans/rebalance") {
    try {
      const body = await readJsonBody(req);
      const adjusted = buildWeeklyPlan({
        ...body,
        backlogHours: Number(body.backlogHours || 0) + Number(body.newBacklogHours || 0)
      });
      sendJson(res, 200, {
        status: "rebalanced",
        generatedAt: new Date().toISOString(),
        plan: adjusted
      });
    } catch (error) {
      const statusCode = error.message === "invalid_json" ? 400 : 413;
      sendJson(res, statusCode, {
        error: {
          code: error.message,
          message: "Unable to process request"
        }
      });
    }
    return;
  }

  sendJson(res, 404, {
    error: { code: "not_found", message: "Route not found" }
  });
});

server.listen(port, () => {
  console.log(`planner-service listening on :${port}`);
});
