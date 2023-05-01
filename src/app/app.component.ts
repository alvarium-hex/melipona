import { ChangeDetectorRef, Component } from '@angular/core';
import { CarpenterService, ChatMessage } from './carpenter.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'melipona';
  entry = "";
  messages: Array<ChatMessage> = [];
  isTyping: boolean = false;
  lastTyping = new Date();

  constructor(
    private carpenter: CarpenterService,
    private changeDetection: ChangeDetectorRef
  ) {
    carpenter.messages.subscribe((message) => {
      console.log("AppComponent: carpenter.messages.subscribe");
      this.isTyping = false;
      this.messages.push(message);
      this.changeDetection.detectChanges();
    });

    carpenter.typing.subscribe(() => {
      console.log("AppComponent: carpenter.typing.subscribe");
      this.isTyping = true;
      this.lastTyping = new Date();
      changeDetection.detectChanges();
      setTimeout(() => {
        // only reset typing if we haven't received another typing event
        if (new Date().getTime() - this.lastTyping.getTime() > 7000) {
          this.isTyping = false;
        }
        changeDetection.detectChanges();
      }, 7000);
    });
  }

  submit() {
    console.log("submit: " + this.entry);
    let success = this.carpenter.submitText(this.entry);
    if (success) {
      this.entry = "";
    }
  }

  addNewLine(event: Event) {
    this.entry += "\n";
  }
}
