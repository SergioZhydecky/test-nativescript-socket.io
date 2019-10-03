import { Component, OnInit } from "@angular/core";
import { SocketIOService } from '~/app/sokentIO.service';

@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit{

  socketIO: SocketIOService<any>;

  ngOnInit() {
    this.socketIO = new SocketIOService<any>({
      ioHost: 'https://host.com',
      ioChanel: 'chat',
      joinRoomString: `chat_room_TOKEN+ID`
    });

    this.socketIO.socketData$.subscribe((message) => {
      console.log('GOT MESSAGE');
      console.log(message);
      alert(message);
    })
  }
}
