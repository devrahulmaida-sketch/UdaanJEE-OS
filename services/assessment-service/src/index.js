import { createServer } from "node:http";

const port = Number(process.env.PORT || 4003);

const server = createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ service: "assessment-service", status: "ok" }));
    return;
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      service: "assessment-service",
      status: "running",
      capability: "test-delivery",
      timestamp: new Date().toISOString()
    })
  );
});

server.listen(port, () => {
  console.log(`assessment-service listening on :${port}`);
});
