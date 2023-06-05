import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatChipsModule } from '@angular/material/chips';
import { MarkdownModule } from 'ngx-markdown';
import { GraphComponent } from './graph/graph.component';
import { ChatComponent } from './chat/chat.component';
import { HttpClientModule } from '@angular/common/http';
import { DraggableDirective } from './directives/draggable.directive';
import { ZoomableDirective } from './directives/zoomable.directive';
import { GraphPageComponent } from './graph.page/graph.page.component';
import { D3Service } from './d3.service';
import { LinkVisualComponent } from './visuals/link-visual/link-visual.component';
import { NodeVisualComponent } from './visuals/node-visual/node-visual.component';

@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    ChatComponent,
    DraggableDirective,
    ZoomableDirective,
    GraphPageComponent,
    LinkVisualComponent,
    NodeVisualComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatSidenavModule,
    MatChipsModule,
    MarkdownModule.forRoot(),
    HttpClientModule,
  ],
  providers: [D3Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
