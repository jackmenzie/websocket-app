import t from "tap";
import { buildServer } from "./server";

t.test("Server", async (t) => {
  const server = buildServer();

  t.teardown(() => {
    server.close();
  });

  t.test("GET", async (t) => {
    const response = await server.inject({
      method: "GET",
      url: "/",
    });

    t.equal(response.statusCode, 200, "returns a status code of 200");
    t.match(
      {
        hello: "world",
      },
      JSON.parse(response.body),
      "returns the expected message"
    );
  });
});
