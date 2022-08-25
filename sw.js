importScripts("js/sw-utils.js");

const STATIC_CACHE_NAME = "static-v2";
const DYNAMIC_CAHCE_NAME = "dynamic-1";
const INMUTABLE_CAHCE_NAME = "inmutable-1";

const APP_SHELL = [
  "/",
  "index.html",
  "css/style.css",
  "img/favicon.ico",
  "img/avatars/spiderman.jpg",
  "img/avatars/hulk.jpg",
  "img/avatars/ironman.jpg",
  "img/avatars/thor.jpg",
  "img/avatars/wolverine.jpg",
  "js/app.js",
  "js/sw-utils.js",
];

const APP_SHELL_INMUTABLE = [
  "https://fonts.googleapis.com/css?family=Quicksand:300,400",
  "https://fonts.googleapis.com/css?family=Lato:400,300",
  "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
  "css/animate.css",
  "js/libs/jquery.js",
];

self.addEventListener("install", (event) => {
  const cacheStatic = caches
    .open(STATIC_CACHE_NAME)
    .then((cache) => cache.addAll(APP_SHELL));

  const cacheInmutable = caches
    .open(INMUTABLE_CAHCE_NAME)
    .then((cache) => cache.addAll(APP_SHELL_INMUTABLE));

  event.waitUntil(Promise.all([cacheInmutable, cacheStatic]));
});

self.addEventListener("activate", (event) => {
  const activated = caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== STATIC_CACHE_NAME && key.includes("static")) {
        return caches.delete(key);
      }
    });
  });

  event.waitUntil(activated);
});

self.addEventListener("fetch", (event) => {
  const response = caches.match(event.request).then((response) => {
    if (response) {
      return response;

    } else {
      return fetch(event.request).then((newResponse) => {
        return updateDynamicCache(
          DYNAMIC_CAHCE_NAME,
          event.request,
          newResponse
        );
      });
    }
  });

  event.respondWith(response);
});
