import { createServer } from "node:http";

const port = Number(process.env.PORT || 4002);

const server = createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ service: "learning-service", status: "ok" }));
    return;
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      service: "learning-service",
      status: "running",
      capability: "topic-graph",
      timestamp: new Date().toISOString()
    })
  );
});

server.listen(port, () => {
  console.log(`learning-service listening on :${port}`);
});
