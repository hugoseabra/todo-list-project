import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common";
import {ConfigService} from "@shared/config/config.service";
import {ConfigModule} from "@shared/config/config.module";
import {DBService} from "@shared/db/db.service";

const OrmModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory() {
    const configService = new ConfigService()
    const dbService = new DBService(configService)
    return dbService.getOptions()
  }
})

@Module({
  imports: [OrmModule],
  providers: [ConfigService, DBService],
  exports: [OrmModule],
})
export class DBModule {
}
