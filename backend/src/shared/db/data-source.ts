import {DataSource} from "typeorm"

import {ConfigService} from "@shared/config/config.service";
import {DBService} from "@shared/db/db.service";

const createDataSource = (): DataSource => {
  const config = new DBService(new ConfigService());
  return config.createDataSource(config.getOptions());
}
/**
 * Used by TypeORM Cli
 * See package.json command at 'npm run orm'
 */
export const defaultDataSource = createDataSource();
