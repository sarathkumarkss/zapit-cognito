import type { DataSourceOptions } from "typeorm";
import { createRepository } from "./zapitRepository";

export { buildDataSourceOptions } from "./config";
export { defaultQueries, loadQuery } from "./queries";
export {
  ZapitDataRepository,
  createDataSource,
  createRepository,
} from "./zapitRepository";

const defaultExport = (overrides?: Partial<DataSourceOptions>) =>
  createRepository(overrides);

export default defaultExport;
