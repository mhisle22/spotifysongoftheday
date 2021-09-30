import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AWSService } from '../services/aws.service';
import { PlaylistComponent } from './playlist.component';

@NgModule({
  imports: [CommonModule],
  declarations: [PlaylistComponent],
  providers: [AWSService]
})
export class PlaylistModule {}