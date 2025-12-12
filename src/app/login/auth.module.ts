import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login.component';
import { SongWidgetModule } from "../song-widget/song-widget.module";
import { AWSService } from '../services/aws.service';

@NgModule({
  imports: [CommonModule, NgbModule, SongWidgetModule, LoginComponent],
  declarations: [],
  providers: [AWSService]
})
export class AuthModule {}
