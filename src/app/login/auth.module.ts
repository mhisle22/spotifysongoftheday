import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login.component';
import { SongWidgetModule } from "../song-widget/song-widget.module";

@NgModule({
  imports: [CommonModule, NgbModule, AuthRoutingModule, SongWidgetModule],
  declarations: [LoginComponent],
})
export class AuthModule {}
