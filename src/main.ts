import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  const docOptions: SwaggerDocumentOptions = {
    operationIdFactory: (
      controllerKey: string,
      methodKey: string
    ) => methodKey
  };
  const options = new DocumentBuilder()
    .setTitle('Toybox')
    .setDescription('A demo backend via Nestjs')
    .setVersion('1.0')
    //.addTag('contact')
    .build();
  const document = SwaggerModule.createDocument(app, options, docOptions);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
