import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SongWidgetComponent } from './song-widget.component';
import { AuthenticateService } from '../services/authenticate.service';
import { SpotifyRequestService } from '../services/spotify-request.service';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule
  ],
  declarations: [SongWidgetComponent],
  exports: [SongWidgetComponent],
  providers: [AuthenticateService, SpotifyRequestService]
})
export class SongWidgetModule {}
