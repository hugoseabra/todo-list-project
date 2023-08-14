import * as fs from 'fs';
import {parse} from 'dotenv';
import {Injectable} from "@nestjs/common";

@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    if (!this.isProduction()) {
      const envFilePath = __dirname + '/../../../.env';
      const existPath = fs.existsSync(envFilePath);

      if (!existPath) {
        console.error('.env file does not exist');
        process.exit(0);
      }

      this.envConfig = parse(fs.readFileSync(envFilePath));
      console.log(`Loaded env vars...`);
    } else {
      this.envConfig = {
        SERVER_PORT: process.env.SERVER_PORT,
      };
    }
  }

  isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  get(key: string, defaultValue?: any): any {
    return this.envConfig[key] || defaultValue;
  }
}
