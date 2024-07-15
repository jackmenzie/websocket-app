import { fastifyWebsocket } from "@fastify/websocket";
import fastify from "fastify";

export function buildServer() {
  const server = fastify();

  server.register(fastifyWebsocket, {
    options: {
      maxPayload: 1048576, // 1 MiB (1024 bytes * 1024 bytes)
    },
    errorHandler(error, socket, request, reply) {},
  });

  server.register(async function () {
    server.route({
      method: "GET",
      url: "/region-system-metrics-ws",
      handler: () => {},
      wsHandler: (socket, request) => {
        console.log("client connected to server");

        socket.on("close", () => {
          console.log("client disconnected from the server");
        });

        socket.on("message", async (clientMessage: string) => {
          const receivedMessage = clientMessage.toString();
          console.log("client sent message", receivedMessage);

          let regions: string[] = [];

          try {
            const parsedMessage = JSON.parse(receivedMessage);
            if (parsedMessage && Array.isArray(parsedMessage.regions)) {
              regions = parsedMessage.regions;
            } else {
              throw new Error();
            }
          } catch (e) {
            console.log("Error parsing client message", receivedMessage);
            const errorMessage = {
              error: "Bad Request",
              message: "message must be an object with property 'regions'",
            };

            socket.send(JSON.stringify(errorMessage));
          }

          const serverMessage = {
            hello: "world",
          };
          socket.send(JSON.stringify(serverMessage));
        });
      },
    });
  });

  return server;
}
