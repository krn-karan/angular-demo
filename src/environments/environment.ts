// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: false,
  RPC_URL: 'https://rpc-evm-sidechain.xrpl.org/',
  CHAIN_ID: '1440002',
  PRIVATE_KEY: '9f690e519c71544d4939982ec93328059ff592ff406d2d2d6ff68ea9c0052195',
  CONTRACT_ADDRESS:'0x0149ea6f5dff73289f7d5dd79600a32a986a67d6' 
};



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
