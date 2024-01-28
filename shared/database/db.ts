import { DataSource } from "typeorm";
import typeOrmConfig from "./config";

const PostgresSource = new DataSource(typeOrmConfig);

let isInitialized = false;

if (!isInitialized) {
  PostgresSource.initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
      isInitialized = true;
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err);
    });
}

export { PostgresSource };
