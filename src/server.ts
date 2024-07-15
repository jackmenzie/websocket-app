import fastify from "fastify";

export function buildServer() {
  const server = fastify();

  server.get("/", async (request, reply) => {
    return { hello: "world" };
  });

  return server;
}
