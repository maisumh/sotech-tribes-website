// App store destinations for the live Tribes app.
//
// ⚠️ BOTH LISTINGS ARE `com.app.trytribes`. That bundle id started life as v1
// (FlutterFlow) and v2 took it over on both platforms — iOS via the Path-A
// takeover of v1's App Store record in July 2026, Android on the same package.
// The older `com.app.tribes` record was the v2 TestFlight sandbox and is NOT
// the public listing. Do not "correct" these to com.app.tribes.
export const STORE = {
  ios: "https://apps.apple.com/us/app/tribes-trade-with-neighbors/id6762868677",
  android: "https://play.google.com/store/apps/details?id=com.app.trytribes",
} as const;

export type StorePlatform = keyof typeof STORE;
