import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const port = Number(process.env.PORT || 4000);
const rootDir = resolve(process.cwd(), "../..");

const featureCatalog = JSON.parse(
  readFileSync(resolve(rootDir, "data/free-features.json"), "utf-8")
);
const roadmapDoc = readFileSync(
  resolve(rootDir, "docs/product/master-roadmap-24-month.md"),
  "utf-8"
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

function generatePlan(input) {
  const dailyHours = Math.max(2, Math.min(12, Number(input.dailyHours) || 6));
  const weakTopics = Array.isArray(input.weakTopics) ? input.weakTopics.slice(0, 5) : [];
  const hasBacklog = Boolean(input.hasBacklog);

  const coreBlocks = [
    { block: "Concept Learning", durationHours: Number((dailyHours * 0.35).toFixed(1)) },
    { block: "Problem Solving", durationHours: Number((dailyHours * 0.4).toFixed(1)) },
    { block: "Revision", durationHours: Number((dailyHours * 0.25).toFixed(1)) }
  ];

  if (hasBacklog) {
    coreBlocks.push({ block: "Backlog Recovery", durationHours: 1 });
  }

  return {
    mode: input.mode || "balanced",
    targetExam: input.targetExam || "JEE Main + Advanced",
    dailyHours,
    weakTopicFocus: weakTopics,
    blocks: coreBlocks,
    nextReviewInDays: 7
  };
}

const server = createServer(async (req, res) => {
  const method = req.method || "GET";
  const url = req.url || "/";

  if (method === "GET" && (url === "/health" || url === "/api/v1/health")) {
    sendJson(res, 200, {
      service: "api-gateway",
      status: "ok",
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (method === "GET" && url === "/api/v1/features") {
    sendJson(res, 200, featureCatalog);
    return;
  }

  if (method === "GET" && url === "/api/v1/roadmap") {
    sendJson(res, 200, {
      title: "24-Month Master Roadmap",
      format: "markdown",
      content: roadmapDoc
    });
    return;
  }

  if (method === "POST" && url === "/api/v1/plans/generate") {
    try {
      const body = await readJsonBody(req);
      const plan = generatePlan(body);
      sendJson(res, 200, {
        status: "generated",
        generatedAt: new Date().toISOString(),
        plan
      });
    } catch (error) {
      const code = error.message === "invalid_json" ? 400 : 413;
      sendJson(res, code, {
        error: {
          code: error.message,
          message: "Unable to process request body"
        }
      });
    }
    return;
  }

  sendJson(res, 404, {
    error: {
      code: "not_found",
      message: "Route not found"
    }
  });
});

server.listen(port, () => {
  console.log(`api-gateway listening on :${port}`);
});
