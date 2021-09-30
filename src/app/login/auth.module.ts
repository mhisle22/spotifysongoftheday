import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login.component';
import { SongWidgetModule } from "../song-widget/song-widget.module";
import { AWSService } from '../services/aws.service';

@NgModule({
  imports: [CommonModule, NgbModule, AuthRoutingModule, SongWidgetModule],
  declarations: [LoginComponent],
  providers: [AWSService]
})
export class AuthModule {}
