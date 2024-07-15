import { fastifyWebsocket } from "@fastify/websocket";
import fastify from "fastify";
import { v4 as uuidv4 } from "uuid";
import { IRegionSystemMetrics } from "./types/region-system-metrics";

const VALID_REGIONS = [
  "us-east",
  "eu-west",
  "eu-central",
  "us-west",
  "sa-east",
  "ap-southeast",
];

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
        const uuid = uuidv4();
        socket.id = uuid;
        socket.subscribedRegions = VALID_REGIONS;
        console.log(`client ${socket.id} connected to server`);

        socket.on("close", () => {
          console.log(`client ${socket.id} disconnected from the server`);
        });

        socket.on("message", async (clientMessage: string) => {
          const receivedMessage = clientMessage.toString();
          console.log(`client ${socket.id} sent message`, receivedMessage);

          let regions: string[] = [];

          try {
            const parsedMessage = JSON.parse(receivedMessage);
            if (parsedMessage && Array.isArray(parsedMessage.regions)) {
              regions = parsedMessage.regions;
            } else {
              throw new Error();
            }
          } catch (e) {
            console.log(
              `client ${socket.id} message failed to be parsed`,
              receivedMessage
            );
            const errorMessage = {
              error: "Bad Request",
              message: "message must be an object with property 'regions'",
            };

            socket.send(JSON.stringify(errorMessage));
            return;
          }

          if (
            regions.filter((region) => !VALID_REGIONS.includes(region)).length >
            0
          ) {
            console.log("Invalid regions request:", regions.join(", "));
            const errorMessage = {
              error: "Bad Request",
              message: "invalid regions requested to be subscribed to",
            };

            socket.send(JSON.stringify(errorMessage));
          }

          socket.subscribedRegions = regions;
          console.log(
            `client ${uuid} subscribed to regions: '${regions.join(", ")}'`
          );

          const serverMessage = {
            message: `Updated regions subscribed to: '${regions.join(", ")}'`,
          };
          socket.send(JSON.stringify(serverMessage));
          return;
        });
      },
    });
  });

  return server;
}
