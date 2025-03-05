// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: false,
  RPC_URL: 'https://rpc-evm-sidechain.xrpl.org/',
  CHAIN_ID: '1440002',
  PRIVATE_KEY: '0xae8f36cfd0850cda1c5ecaa2d0728efe76bf4d7ff883553d3914662b69b3494b',
  CONTRACT_ADDRESS:'0x1b0224bC6C8ee261d70FddC6dF614588fc56336C' 
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
