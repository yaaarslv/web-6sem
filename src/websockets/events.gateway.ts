import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class EventsGateway {
    @WebSocketServer() server: Server;

    @SubscribeMessage('events')
    handleEvent(@MessageBody() data: string): string {
        return data;
    }
}
