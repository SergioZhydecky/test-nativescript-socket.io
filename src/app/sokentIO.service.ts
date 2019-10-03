import * as SocketIO from 'nativescript-socket.io';
import { Observable, Subject, Subscription } from 'rxjs';
import { SocketSettingsInterface } from '~/app/socket-settings.interface';

SocketIO.enableDebug();

export class SocketIOService<T> {

  public socketData$: Observable<T>;

  private socket;

  private socketDataBehaviorSubject: Subject<T> = new Subject();

  private subscription: Subscription = new Subscription();

  constructor(payload: SocketSettingsInterface) {
    this.socketData$ = this.socketDataBehaviorSubject.asObservable();
    this.subscription.add(this.socketDataBehaviorSubject);

    // Create connection
    this.socket = SocketIO.connect(`${payload['ioHost']}/socket.io/${payload['ioChanel']}`);
    this.joinRoom(payload['joinRoomString']);

    // Emit events
    this.onMessages();
  }

  public getData(): Observable<T> {
    return this.socketData$;
  }

  public disconnect() {
    this.socket.disconnect();
    this.subscription.unsubscribe();
  }

  private onMessages(event: string = 'new_chat_message') {
    this.socket.on(event, (data) => {
      const msg = data.message;
      this.setDataBehaviorSubject(msg);
    });
  }

  private setDataBehaviorSubject(data) {
    this.socketDataBehaviorSubject.next(data);
  }

  private joinRoom(joinRoomString: string) {
    // {room: `chat_room_${TOKEN}${dialogID}`}
    this.socket.emit('join', {room: joinRoomString});
  }

}
