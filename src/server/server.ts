import { fastifyWebsocket, WebSocket } from "@fastify/websocket";
import fastify from "fastify";
import { v4 as uuidv4 } from "uuid";
import { RegionSystemMetricsPort } from "./ports/region-system-metrics";
import { FastifyInstance } from "fastify/types/instance";
import FastifyVite from "@fastify/vite";
import { resolve } from "node:path";
import { clearInterval } from "node:timers";

interface ExtendedWebsocket extends WebSocket {
  id: string;
  subscribedRegions: string[];
}

const VALID_REGIONS = [
  "us-east",
  "eu-west",
  "eu-central",
  "us-west",
  "sa-east",
  "ap-southeast",
];

export function broadcastRegionalData(
  regionSystemMetricsPort: RegionSystemMetricsPort,
  server: FastifyInstance,
  interval: number = 3000
) {
  const intervalId = setInterval(async () => {
    const regionSystemMetricData =
      await regionSystemMetricsPort.getRegionsSystemMetrics(VALID_REGIONS);

    // TODO: Send message only for subscribed regions
    // Send data for each of the regional endpoints
    server.websocketServer.clients.forEach((client) => {
      // const subscribedRegionSystemMetricData = regionSystemMetricData.filter(
      //   (region) => client.subscribedRegions.includes(region)
      // );
      const message = {
        regionData: regionSystemMetricData,
      };
      client.send(JSON.stringify(message));
    });
  }, interval);

  return () => clearInterval(intervalId);
}

export async function buildServer() {
  const server = fastify();
  const regionSystemMetricsPort = new RegionSystemMetricsPort();

  server.register(fastifyWebsocket);

  const cancelBroadcast = broadcastRegionalData(
    regionSystemMetricsPort,
    server
  );

  server.register(async function () {
    server.route({
      method: "GET",
      url: "/region-system-metrics-ws",
      handler: () => {},
      wsHandler: (websocket) => {
        const socket = websocket as ExtendedWebsocket;

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
            console.log(
              `client ${
                socket.id
              } requested invalid regions to be subscribed to '${regions.join(
                ", "
              )}'`
            );
            const errorMessage = {
              error: "Bad Request",
              message: "invalid regions requested to be subscribed to",
            };

            socket.send(JSON.stringify(errorMessage));
            return;
          }

          socket.subscribedRegions = regions;
          console.log(
            `client ${socket.id} subscribed to regions: '${regions.join(", ")}'`
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

  await server.register(FastifyVite, {
    root: resolve(__dirname, "../../"),
    dev: process.argv.includes("--dev"),
    spa: true,
  });

  server.get("/app", (req, reply) => {
    return reply.html();
  });

  await server.vite.ready();
  await server.ready();

  return { server, cancelBroadcast };
}
