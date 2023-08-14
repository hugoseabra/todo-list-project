import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
// import * as helmet from 'helmet';
import {AppModule} from './app.module';


async function bootstrap() {
  // const app = await NestFactory.create(await AppModule.forRoot(), { cors: true });
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('TODO List')
    .setDescription('TODO List sample app using NestJS')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // app.use(helmet());
  // app.enableCors();
  // app.setGlobalPrefix('api');

  await app.listen(AppModule.server_port, AppModule.server_host);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
