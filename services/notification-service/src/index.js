import { createServer } from "node:http";

const port = Number(process.env.PORT || 4006);

const server = createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ service: "notification-service", status: "ok" }));
    return;
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      service: "notification-service",
      status: "running",
      capability: "reminder-dispatch",
      timestamp: new Date().toISOString()
    })
  );
});

server.listen(port, () => {
  console.log(`notification-service listening on :${port}`);
});
