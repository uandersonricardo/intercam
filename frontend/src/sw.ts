import { precacheAndRoute } from "workbox-precaching";

declare let self: ServiceWorkerGlobalScope;

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();

    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon,
        badge: data.badge,
        data: data.data,
      })
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  event.waitUntil(
    self.clients
      .matchAll({
        type: "window",
      })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === "/calls/" + event.notification.data.id && "focus" in client) return client.focus();
        }
        
        if (self.clients.openWindow) return self.clients.openWindow("/calls/" + event.notification.data.id);
      })
  );
}, false);

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST);
