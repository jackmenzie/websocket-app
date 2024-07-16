import { SimpleGrid, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import useWebSocket from "react-use-websocket";
import { IRegionSystemMetrics } from "../types/region-system-metrics";
import RegionSystemMetricCard from "./RegionSystemMetricCard";

const WS_URL =
  "https://websocket-app-497x.onrender.com/region-system-metrics-ws";

const regions = [
  "us-east",
  "eu-west",
  "eu-central",
  "us-west",
  "sa-east",
  "ap-southeast",
];

export default function WebSocket() {
  const [regionSystemMetrics, setRegionSystemMetrics] = useState<
    IRegionSystemMetrics[]
  >([]);

  const { sendMessage } = useWebSocket(WS_URL, {
    onOpen: () => {
      const message = JSON.stringify({ regions });
      sendMessage(message);
    },
    onMessage: (event: { data: string }) => {
      const { data } = event;
      const result = JSON.parse(data);
      if (result.regionData) {
        setRegionSystemMetrics(result.regionData);
      }
    },
  });

  return (
    <SimpleGrid
      spacing={6}
      templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
    >
      {regionSystemMetrics.length === 0 && <Spinner size={"xl"} />}

      {regionSystemMetrics.map((regionData: IRegionSystemMetrics, index) => (
        <RegionSystemMetricCard regionData={regionData} key={index} />
      ))}
    </SimpleGrid>
  );
}
