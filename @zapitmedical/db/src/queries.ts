import fs from "fs";
import path from "path";

const queriesRoot = path.resolve(__dirname, "..", "queries");

export const loadQuery = (name: string) => {
  const filePath = path.join(queriesRoot, `${name}.sql`);
  return fs.readFileSync(filePath, { encoding: "utf8" });
};

export const defaultQueries = {
  machine_test: loadQuery("machine_tests"),
  scratch: loadQuery("scratch"),
  scratch2: loadQuery("scratch2"),
};
