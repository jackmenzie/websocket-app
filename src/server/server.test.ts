import t from "tap";
import { buildServer } from "./server";
import { usEast } from "./mocks/region-system-metrics";
import fetchMock from "fetch-mock";

t.test("Region System Metrics WebSocket", async (t) => {
  const { server, cancelBroadcast } = await buildServer();

  t.teardown(() => {
    server.close();
  });

  t.test("Connects to WS and sends/receives valid message", async (t) => {
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
    // @ts-ignore
    const result = JSON.parse(response);
    socket.terminate();

    t.match(
      result,
      {
        message: `Updated regions subscribed to: '${clientMessage.regions.join(
          ", "
        )}'`,
      },
      "returns the expected response"
    );
  });

  t.test("Connects to WS and sends/receives invalid message", async (t) => {
    const socket = await server.injectWS("/region-system-metrics-ws");
    const clientMessage = "Invalid message";

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
    // @ts-ignore
    const result = JSON.parse(response);
    socket.terminate();

    t.match(
      result,
      {
        error: "Bad Request",
        message: "message must be an object with property 'regions'",
      },
      "returns the expected response"
    );
  });

  t.test("Connects to WS and sends/receives invalid region", async (t) => {
    const socket = await server.injectWS("/region-system-metrics-ws");
    const clientMessage = {
      regions: ["INVALID_REGION"],
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
    // @ts-ignore
    const result = JSON.parse(response);
    socket.terminate();

    t.match(
      result,
      {
        error: "Bad Request",
        message: "invalid regions requested to be subscribed to",
      },
      "returns the expected response"
    );
  });

  t.test("Connects to WS and receives information for a region", async (t) => {
    const mockResponse = {
      status: 200,
      body: usEast,
    };
    fetchMock.mock(
      `https://data--us-east.upscope.io/status?stats=1`,
      mockResponse
    );

    const socket = await server.injectWS("/region-system-metrics-ws");

    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    socket.on("message", (data) => {
      resolvePromise(data.toString());
    });

    const response = await promise;
    // @ts-ignore
    const result = JSON.parse(response);

    t.match(
      result,
      {
        regionData: [usEast, null, null, null, null, null],
      },
      "returns the expected response"
    );
    socket.terminate();
    cancelBroadcast();
  });
});
