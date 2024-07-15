import { buildServer } from "./server";

async function main() {
  const server = await buildServer();

  server.listen({ port: 8080 }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
}

main();
