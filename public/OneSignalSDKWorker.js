// Ensure event handlers are registered synchronously on initial evaluation
self.addEventListener('message', () => {});
self.addEventListener('push', () => {});
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
