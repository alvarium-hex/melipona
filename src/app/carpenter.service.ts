import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ChatMessage {
  content: string;
  channel: number;
  author: string;
  metadata: Map<String, String>;
}

@Injectable({
  providedIn: 'root'
})
export class CarpenterService {
  // private subject = AnonymousSubject<>
  public messages: Subject<ChatMessage>;
  public typing: Subject<void>;
  public ws: WebSocket;
  channel: number;

  constructor() {
    this.channel = this.getId();

    console.info("CarpenterService: constructor");

    this.messages = new Subject<ChatMessage>();
    this.typing = new Subject<void>();

    this.ws = this.connect();
  }

  connect(): WebSocket {
    this.ws = new WebSocket("ws://192.168.86.100:3001");

    this.ws.onmessage = (event) => {
      let message = JSON.parse(event.data);
      console.debug(message);
      if (message.op == 1) {
        console.log("typing");
        this.typing.next();
      } else {
        this.messages.next(JSON.parse(message.d));
      }

      console.debug(event);
    };

    this.ws.onclose = (event) => {
      setTimeout(() => {
        console.log("reconnecting");
        this.connect();
      }, 1000);
    };

    this.ws.onerror = (event) => {
      console.error(event);
    };

    this.ws.onopen = (event) => {
      console.info(event);
    }

    return this.ws;
  }

  getId() {
    return Math.floor(Math.random() * (10000 - 0 + 1)) + 0;
  }

  submitText(text: string, author: string = "Anonymous"): boolean {
    if (this.ws.readyState === WebSocket.OPEN) {
      let message = {
        content: text,
        channel: this.channel,
        author,
        metadata: new Map()
      };
      this.messages.next(message);
      let json = JSON.stringify(message);
      console.debug(json);
      this.ws.send(json);
      return true;
    }

    return false;
  }
}
