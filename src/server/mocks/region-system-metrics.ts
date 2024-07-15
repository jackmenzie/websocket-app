import { IRegionSystemMetrics } from "../types/region-system-metrics";

export const usEast: IRegionSystemMetrics = {
  status: "ok",
  region: "us-east",
  roles: ["socket"],
  results: {
    services: {
      redis: true,
      database: true,
    },
    stats: {
      servers_count: 2,
      online: 17357,
      session: 13,
      server: {
        active_connections: 10370,
        wait_time: 487,
        workers: [
          [
            "requests:pageviews",
            {
              wait_time: 0,
              workers: 0,
              waiting: 0,
              idle: 0,
              time_to_return: 0,
              recently_blocked_keys: [],
              top_keys: [],
            },
          ],
          [
            "io",
            {
              wait_time: 487,
              workers: 5762,
              waiting: 1,
              idle: 576,
              time_to_return: 0,
              recently_blocked_keys: [
                ["3FG7RD4yF6", 2, "2024-07-11T12:12:29.249Z"],
              ],
              top_keys: [
                ["3FG7RD4yF6", 0.1193567138151521],
                ["rMccHqnmWV", 0.19492346444487502],
                ["Bvy5aLQrQE", 0.04262739779112575],
                ["HeuVtDRwCu1y4Skn6aX85U54", 0.053090486339856614],
                ["vNadmch1EMTz7cXQdvF9tMNc", 0.055221856229412905],
              ],
            },
          ],
          [
            "requests:unsupported-users",
            {
              wait_time: 0,
              workers: 0,
              waiting: 0,
              idle: 0,
              time_to_return: 0,
              recently_blocked_keys: [],
              top_keys: [],
            },
          ],
          [
            "recording-workers",
            {
              wait_time: 0,
              workers: 2,
              waiting: 0,
              idle: 2,
              time_to_return: 0,
              recently_blocked_keys: [],
              top_keys: [],
            },
          ],
        ],
        cpu_load: 0.23,
        timers: 100,
      },
    },
  },
  strict: false,
  server_issue: null,
};
