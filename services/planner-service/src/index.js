import { createServer } from "node:http";

const port = Number(process.env.PORT || 4001);

const server = createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ service: "planner-service", status: "ok" }));
    return;
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      service: "planner-service",
      status: "running",
      capability: "schedule-generation",
      timestamp: new Date().toISOString()
    })
  );
});

server.listen(port, () => {
  console.log(`planner-service listening on :${port}`);
});
