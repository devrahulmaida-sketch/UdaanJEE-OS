import { createServer } from "node:http";

const port = Number(process.env.PORT || 4004);

const server = createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ service: "analytics-service", status: "ok" }));
    return;
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      service: "analytics-service",
      status: "running",
      capability: "insight-generation",
      timestamp: new Date().toISOString()
    })
  );
});

server.listen(port, () => {
  console.log(`analytics-service listening on :${port}`);
});
