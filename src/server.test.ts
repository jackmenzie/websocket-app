import t from "tap";
import { buildServer } from "./server";

t.test("Region System Metrics WebSocket", async (t) => {
  const server = buildServer();
  await server.ready();

  t.teardown(() => {
    server.close();
  });

  t.test("Connects to websocket successfully", async () => {
    const socket = await server.injectWS("/region-system-metrics-ws");
    const clientMessage = {
      regions: ["us-east"],
    };

    // Resolves promise when server receives the message
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    socket.on("message", (data) => {
      resolvePromise(data.toString());
    });

    socket.send(JSON.stringify(clientMessage));
    const response = await promise;
    const result = JSON.parse(response);
    socket.terminate();

    t.match(result, {
      hello: "world",
    });
  });
});
