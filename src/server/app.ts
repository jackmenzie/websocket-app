import { buildServer } from "./server";

async function main() {
  const { server } = await buildServer();
  const host = "RENDER" in process.env ? `0.0.0.0` : `localhost`;
  const port = Number(process.env.PORT) || 10000;

  server.listen({ host, port }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
}

main();
