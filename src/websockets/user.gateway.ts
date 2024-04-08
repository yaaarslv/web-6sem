import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway()
export class UserGateway {
    @WebSocketServer() server: Server;

    async sendUserUpdate(userId: number, newData: any) {
        try {
            this.server.emit('userUpdate', { userId, ...newData });
        } catch (error) {
            console.error(error);
        }
    }
}
