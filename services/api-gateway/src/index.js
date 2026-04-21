import { createServer } from "node:http";

const port = Number(process.env.PORT || 4000);

const server = createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ service: "api-gateway", status: "ok" }));
    return;
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      service: "api-gateway",
      status: "running",
      timestamp: new Date().toISOString()
    })
  );
});

server.listen(port, () => {
  console.log(`api-gateway listening on :${port}`);
});
