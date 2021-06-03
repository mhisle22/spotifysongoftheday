import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';
import { environment } from '../../environments/environment';


const CLIENT_ID = '5afa66ec3eda4ecbb2e3d82139819866';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  version: string = environment.version;
  error: string | undefined;
  accessToken: string | undefined;


  constructor(@Inject(DOCUMENT) private document: Document,
              private route: ActivatedRoute,
              private sessionStorage: SessionStorageService) {
  }

  ngOnInit() {
    // testing only
    if (this.version === 'qa') {
      this.accessToken = environment.accessToken;
    }
    else {
      this.route.queryParams.subscribe(fragment => {
        if (Object.keys(fragment).length !== 0) {
          // did not authorize
          if (fragment.error || fragment.state !== '123') {
            this.error = fragment.error;
            this.accessToken = 'Access Denied';
            return;
          }
          this.accessToken = fragment.code;

        }
      });
    }
  }

  login() {
    this.sessionStorage.set('verifier', this.codeVerifier());

    this.pkce_challenge_from_verifier(this.sessionStorage.get('verifier')).then((challenge) => {
       this.document.location.href = 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
        '&redirect_uri=https:%2F%2Fmhisle22.github.io%2Fspotifysongoftheday%2F&response_type=code&scope=user-top-read&code_challenge_method=S256&state=123&code_challenge='
        + challenge;
    });
  }

  codeVerifier(): string {
    let verifier = Math.random().toString(36).substring(2);
    for (let i = 0; i < 10; i++) {
      verifier += Math.random().toString(36).substring(2);
    }
    return verifier;
  }

  sha256(plain: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
  }

  base64urlencode(a: ArrayBuffer): string {
    const numArray = new Uint8Array(a);
    return btoa(String.fromCharCode.apply(null, Array.from(numArray)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  async pkce_challenge_from_verifier(v: string): Promise<string> {
    const hashed = await this.sha256(v);
    const base64encoded = this.base64urlencode(hashed);
    return base64encoded;
  }

  back() {
    this.sessionStorage.set('refresh_token', null); // uncommon, but delete token if they deny after previously accepting
    this.document.location.href = 'https://mhisle22.github.io/SongOfTheDay/';
  }

}
