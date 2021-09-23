import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlaylistComponent } from '../playlist/playlist.component';

import { LoginComponent } from './login.component';

const routes: Routes = [{ path: '', component: LoginComponent },
                        { path: 'login', component: LoginComponent },
                        { path: 'playlist', component: PlaylistComponent },
                        { path: '**', pathMatch: 'full', component: LoginComponent }
                  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AuthRoutingModule {}
