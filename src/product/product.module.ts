import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    // Registering the ClientsModule for microservices communication
    ClientsModule.register([
      {
        // Name of the service, used for dependency injection
        name: 'PRODUCT_SERVICE',
        // Transport layer protocol, here using RabbitMQ
        transport: Transport.RMQ,
        options: {
          // URL of the RabbitMQ server
          urls: [
            'amqps://jdhgzqai:R2dwAUk-WOnJ8jhCRaNvza0_uOWLH5ZW@toad.rmq.cloudamqp.com/jdhgzqai',
          ],
          // Queue name which your server will listen to
          queue: 'main_queue',
          // Queue options configuration
          queueOptions: {
            durable: false, // Setting the queue to non-durable (will not survive a broker restart)
          },
        },
      },
    ]),
  ],
  // Controllers that handle incoming requests and return responses
  controllers: [ProductController],
  // Providers are used to inject dependencies; here, ProductService is provided
  providers: [ProductService],
})
export class ProductModule {}
