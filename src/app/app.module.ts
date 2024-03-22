import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from "./login/auth.module";
import { SpotifyRequestService } from "./services/spotify-request.service";
import { AuthenticateService } from "./services/authenticate.service";
import { SongWidgetModule } from "./song-widget/song-widget.module";
import { HttpClientModule } from "@angular/common/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";
import { AWSService } from './services/aws.service';
import { MatSortModule } from '@angular/material/sort';
import { CdkTableModule } from '@angular/cdk/table';
import { PlaylistComponent } from './playlist/playlist.component';


@NgModule({
  declarations: [
    AppComponent,
    PlaylistComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    CommonModule,
    HttpClientModule,
    AuthModule,
    SongWidgetModule,
    AppRoutingModule,
    MatTableModule,
    MatSortModule,
    CdkTableModule
  ],
  providers: [SpotifyRequestService, AuthenticateService, AWSService],
  bootstrap: [AppComponent]
})
export class AppModule { }
