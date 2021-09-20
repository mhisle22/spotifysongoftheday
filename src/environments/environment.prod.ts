// prod-only environment

import pkg from '../../package.json';
import { EnvironmentInterface } from "./environment.interface";

export const environment: EnvironmentInterface = {
  production: true,
  version: pkg.version,
  accessToken: '',
  userID: '',
  songs: []
};
