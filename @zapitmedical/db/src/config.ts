import type { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";

const parseNumber = (value?: string) => {
  if (!value) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseJson = <T>(value?: string): T | undefined => {
  if (!value) {
    return undefined;
  }
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn("Invalid JSON in ZAPIT_DB_REPLICATION:", error);
    return undefined;
  }
};

const parseReplicationHosts = () => {
  const readHosts = (process.env.ZAPIT_DB_READ_HOSTS ?? "")
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean);

  if (readHosts.length === 0) {
    return undefined;
  }

  const port = parseNumber(process.env.ZAPIT_DB_PORT);
  const username =
    process.env.ZAPIT_DB_USERNAME ?? process.env.ZAPIT_DB_USER ?? "root";
  const password = process.env.ZAPIT_DB_PASSWORD ?? "";

  return {
    master: {
      host: process.env.ZAPIT_DB_WRITE_HOST ?? process.env.ZAPIT_DB_HOST ?? "localhost",
      port,
      username,
      password,
      database: process.env.ZAPIT_DB_NAME ?? process.env.ZAPIT_DB ?? "zapit",
    },
    slaves: readHosts.map((host) => ({
      host,
      port,
      username,
      password,
      database: process.env.ZAPIT_DB_NAME ?? process.env.ZAPIT_DB ?? "zapit",
    })),
  };
};

export const buildDataSourceOptions = (): MysqlConnectionOptions => {
  const replication =
    parseJson<MysqlConnectionOptions["replication"]>(
      process.env.ZAPIT_DB_REPLICATION
    ) ?? parseReplicationHosts();

  const connectTimeout =
    parseNumber(process.env.ZAPIT_DB_CONNECT_TIMEOUT) ?? 30000;

  return {
    type: "mysql",
    host: process.env.ZAPIT_DB_HOST ?? "localhost",
    port: parseNumber(process.env.ZAPIT_DB_PORT) ?? 3306,
    username:
      process.env.ZAPIT_DB_USERNAME ?? process.env.ZAPIT_DB_USER ?? "root",
    password: process.env.ZAPIT_DB_PASSWORD ?? "",
    database: process.env.ZAPIT_DB_NAME ?? process.env.ZAPIT_DB ?? "zapit",
    logging: process.env.ZAPIT_DB_LOGGING === "true",
    synchronize: false,
    entities: [],
    replication,
    connectTimeout,
    extra: {
      connectionLimit: parseNumber(process.env.ZAPIT_DB_POOL_MAX) ?? 20,
    },
  };
};
