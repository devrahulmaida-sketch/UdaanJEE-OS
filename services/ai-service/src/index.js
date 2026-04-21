import { createServer } from "node:http";

const port = Number(process.env.PORT || 4005);

const server = createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ service: "ai-service", status: "ok" }));
    return;
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      service: "ai-service",
      status: "running",
      capability: "recommendation-orchestration",
      timestamp: new Date().toISOString()
    })
  );
});

server.listen(port, () => {
  console.log(`ai-service listening on :${port}`);
});
