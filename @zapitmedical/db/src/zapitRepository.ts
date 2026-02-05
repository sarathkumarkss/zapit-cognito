import "reflect-metadata";
import fs from "fs";
import path from "path";
import { DataSource, type DataSourceOptions, type EntityManager } from "typeorm";
import { buildDataSourceOptions } from "./config";

const queriesRoot = path.resolve(__dirname, "..", "queries");

export class ZapitDataRepository {
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  get isInitialized() {
    return this.dataSource.isInitialized;
  }

  get manager() {
    return this.dataSource.manager;
  }

  async initialize() {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }
    return this.dataSource;
  }

  async destroy() {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
    }
  }

  async query<T = unknown>(sql: string, parameters?: unknown[]) {
    return this.dataSource.query(sql, parameters) as Promise<T[]>;
  }

  async withTransaction<T>(run: (manager: EntityManager) => Promise<T>) {
    return this.dataSource.transaction(run);
  }

  loadSql(name: string) {
    const filePath = path.join(queriesRoot, `${name}.sql`);
    return fs.readFileSync(filePath, { encoding: "utf8" });
  }
}

export const createDataSource = (
  overrides?: Partial<DataSourceOptions>
) => new DataSource({ ...buildDataSourceOptions(), ...overrides });

export const createRepository = (
  overrides?: Partial<DataSourceOptions>
) => new ZapitDataRepository(createDataSource(overrides));
