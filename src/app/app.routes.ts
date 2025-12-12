// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PlaylistComponent } from './playlist/playlist.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'playlist', component: PlaylistComponent },
  { path: '**', redirectTo: 'login' }
];