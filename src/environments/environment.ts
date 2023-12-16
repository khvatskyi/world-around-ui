// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiBaseUrl: "https://localhost:7073/api/",
  // cloudStorageUrl: "https://wolrdaroundstorage.blob.core.windows.net/",
  cloudStorageUrl: "http://127.0.0.1:10000/devstoreaccount1/",
  localStorageUrl: "assets/user-images/",
  sasToken: '?sv=2023-01-03&ss=btqf&srt=sco&spr=https%2Chttp&st=2023-12-02T11%3A40%3A00Z&se=2024-03-04T11%3A40%3A00Z&sp=rl&sig=qyhyAu6GixQeS4GiwlRz041wXFvnl%2FMQ%2FglQohCGJ7w%3D'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
