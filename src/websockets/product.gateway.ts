import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway()
export class ProductGateway {
    @WebSocketServer() server: Server;

    async sendProductUpdate(productId: number, newData: any) {
        try {
            this.server.emit('productUpdate', { productId, ...newData });
        } catch (error) {
            console.error(error);
        }
    }
}
