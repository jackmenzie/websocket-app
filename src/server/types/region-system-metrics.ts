interface RecentlyBlockedKey {
  [index: number]: string | number;
}

interface TopKey {
  [index: number]: string | number;
}

interface WorkerDetails {
  wait_time: number;
  workers: number;
  waiting: number;
  idle: number;
  time_to_return: number;
  recently_blocked_keys: RecentlyBlockedKey[];
  top_keys: TopKey[];
}

interface Server {
  active_connections: number;
  wait_time: number;
  workers: [string, WorkerDetails][];
  cpu_load: number;
  timers: number;
}

interface Stats {
  servers_count: number;
  online: number;
  session: number;
  server: Server;
}

interface Services {
  redis: boolean;
  database: boolean;
}

interface Results {
  services: Services;
  stats: Stats;
}

export interface IRegionSystemMetrics {
  status: string;
  region: string;
  roles: string[];
  results: Results;
  strict: boolean;
  server_issue: string;
}
