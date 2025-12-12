import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
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
import { PlaylistComponent } from './playlist/playlist.component';
import { CdkTableModule } from '@angular/cdk/table';

@NgModule({
  declarations: [ AppComponent
  ],
  imports: [
    NgbModule,
    CommonModule,
    AuthModule,
    SongWidgetModule,
    MatTableModule,
    MatSortModule,
    CdkTableModule,
    PlaylistComponent,
    AppRoutingModule
  ],
  providers: [SpotifyRequestService, AuthenticateService, AWSService],
  bootstrap: [AppComponent]
})
export class AppModule { }