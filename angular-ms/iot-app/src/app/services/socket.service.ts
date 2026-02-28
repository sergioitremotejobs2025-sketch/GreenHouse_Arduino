import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private socket: Socket;
    private measureUpdateSubject = new Subject<any>();
    measureUpdate$ = this.measureUpdateSubject.asObservable();

    constructor() {
        this.socket = io(environment.ORCHESTRATOR_MS);

        this.socket.on('measure_update', (data) => {
            this.measureUpdateSubject.next(data);
        });

        this.socket.on('connect', () => {
            console.log('Connected to Orchestrator via WebSockets');
        });
    }

    emit(event: string, data: any): void {
        this.socket.emit(event, data);
    }
}
