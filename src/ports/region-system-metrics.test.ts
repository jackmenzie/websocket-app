import t from "tap";
import fetchMock from "fetch-mock";
import { RegionSystemMetricsPort } from "./region-system-metrics";
import { usEast } from "../mocks/region-system-metrics";

t.test("Region System Metrics Port", async (t) => {
  const region = "us-east";
  const regionSystemMetricsPort = new RegionSystemMetricsPort();
  const mockResponse = {
    status: 200,
    body: usEast,
  };

  t.afterEach(() => {
    fetchMock.restore();
  });

  t.test("Calls API with success", async () => {
    fetchMock.get(
      `https://data--${region}.upscope.io/status?stats=1`,
      mockResponse
    );

    const result = await regionSystemMetricsPort.getRegionSystemMetrics(region);
    t.match(result, usEast, "returns the expected reponse");
  });

  t.test("Calls API with non-ok response", async () => {
    fetchMock.mock(`https://data--${region}.upscope.io/status?stats=1`, {
      status: 500,
    });

    const result = await regionSystemMetricsPort.getRegionSystemMetrics(region);
    t.match(result, undefined, "returns the expected reponse");
  });

  t.test("Calls API with error thrown", async () => {
    fetchMock.mock(`https://data--${region}.upscope.io/status?stats=1`, {
      throws: new Error("Fetch error"),
    });

    const result = await regionSystemMetricsPort.getRegionSystemMetrics(region);
    t.match(result, undefined, "returns the expected reponse");
  });
});
