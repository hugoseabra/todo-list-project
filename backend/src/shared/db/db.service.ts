import {DataSource, DataSourceOptions} from "typeorm";

import {ConfigService} from "@shared/config/config.service";
import {Configuration} from "@shared/config/config.keys";
import {Injectable} from "@nestjs/common";

@Injectable()
export class DBService {
  constructor(private readonly configService: ConfigService) {
  }

  getOptions(synchronize?: boolean, dropSchema?: boolean): DataSourceOptions {
    dropSchema = dropSchema == true && !this.configService.isProduction()

    return {
      type: "postgres" as "postgres",
      host: this.configService.get(Configuration.DB_HOST, "localhost"),
      port: parseInt(this.configService.get(Configuration.DB_PORT, 5432)),
      username: this.configService.get(Configuration.DB_USERNAME, "postgres"),
      password: this.configService.get(Configuration.DB_PASSWORD, "postgres"),
      database: this.configService.get(Configuration.DB_NAME, "db"),
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../../shared/db/migrations/*{.ts,.js}'],
      synchronize: synchronize === true,
      dropSchema: dropSchema === true,
    }
  }

  createDataSource(options: DataSourceOptions): DataSource {
    return new DataSource(options)
  }
}
