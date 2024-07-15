import { IRegionSystemMetrics } from "../types/region-system-metrics";

export class RegionSystemMetricsPort {
  constructor() {}

  async getRegionSystemMetrics(
    region: string
  ): Promise<IRegionSystemMetrics | undefined> {
    try {
      const response = await fetch(
        `https://data--${region}.upscope.io/status?stats=1`,
        {
          signal: AbortSignal.timeout(5000), // Allows Promise.allSettled() not to hang
        }
      );

      if (!response.ok) {
        console.log(`Error fetching data for region ${region}`);
        return undefined;
      }

      const result: IRegionSystemMetrics = await response.json();
      return result;
    } catch (e) {
      console.log(`Error fetching data for region ${region}`, e);
      return undefined;
    }
  }

  async getRegionsSystemMetrics(
    regions: string[]
  ): Promise<(IRegionSystemMetrics | undefined)[]> {
    const promises = regions.map(
      async (region) => await this.getRegionSystemMetrics(region)
    );

    const settledPromises = await Promise.allSettled(promises);

    const results = settledPromises.map((promise, index) => {
      if (promise.status === "fulfilled") {
        return promise.value;
      } else {
        console.log(
          `Error fetching data for region ${regions[index]}:`,
          promise.reason
        );
        return undefined;
      }
    });

    return results;
  }
}
