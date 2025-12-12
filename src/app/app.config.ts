import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { SpotifyRequestService } from './services/spotify-request.service';
import { AuthenticateService } from './services/authenticate.service';
import { AWSService } from './services/aws.service';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    SpotifyRequestService,
    AuthenticateService,
    AWSService
  ]
};