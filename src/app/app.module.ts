import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from "./login/auth.module";
import { SpotifyRequestService } from "./song-widget/spotify-request.service";
import { AuthenticateService } from "./song-widget/authenticate.service";
import { SongWidgetModule } from "./song-widget/song-widget.module";
import { HttpClientModule } from "@angular/common/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    CommonModule,
    HttpClientModule,
    AuthModule,
    SongWidgetModule,
    AppRoutingModule
  ],
  providers: [SpotifyRequestService, AuthenticateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
