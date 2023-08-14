import {Module} from "@nestjs/common";

import {ConfigModule} from "@shared/config/config.module";
import {ConfigService} from "@shared/config/config.service";
import {Configuration} from "@shared/config/config.keys";
import {DBModule} from "@shared/db/db.module";
import {TodoModule} from "@apps/todo/todo.module";

@Module({
  imports: [ConfigModule, DBModule, TodoModule]
})
export class AppModule {
  static server_host: string;
  static server_port: number | string;

  constructor(private readonly _configService: ConfigService) {
    AppModule.server_host = this._configService.get(Configuration.SERVER_HOST, "0.0.0.0");
    AppModule.server_port = this._configService.get(Configuration.SERVER_PORT, 3000);
  }
}
