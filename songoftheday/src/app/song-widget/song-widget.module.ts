import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SongWidgetComponent } from './song-widget.component';
import { AuthenticateService } from './authenticate.service';
import { SpotifyRequestService } from './spotify-request.service';

@NgModule({
  imports: [CommonModule],
  declarations: [SongWidgetComponent],
  exports: [SongWidgetComponent],
  providers: [AuthenticateService, SpotifyRequestService]
})
export class SongWidgetModule {}
