// src/app.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class AppGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): void {
    console.log(`Received message: ${data}`);
    client.broadcast.emit('message', data);
  }

  @SubscribeMessage('offer')
  handleOffer(
    @MessageBody() offer: any,
    @ConnectedSocket() client: Socket,
  ): void {
    // オファーを受信したら、他のクライアントに転送します
    client.broadcast.emit('offer', offer);
  }

  @SubscribeMessage('answer')
  handleAnswer(
    @MessageBody() answer: any,
    @ConnectedSocket() client: Socket,
  ): void {
    // アンサーを受信したら、他のクライアントに転送します
    client.broadcast.emit('answer', answer);
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(
    @MessageBody() candidate: any,
    @ConnectedSocket() client: Socket,
  ): void {
    // ICE候補を受信したら、他のクライアントに転送します
    client.broadcast.emit('ice-candidate', candidate);
  }
}
