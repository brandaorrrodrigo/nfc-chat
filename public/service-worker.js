/**
 * Service Worker for Push Notifications
 */

self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};

  const title = data.title || 'NutriFitCoach';
  const options = {
    body: data.message || 'Nova notificação',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    data: data.metadata || {},
    actions: data.actions || [],
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const urlToOpen = event.notification.data.url || '/';

  event.waitUntil(
    clients.openWindow(urlToOpen)
  );
});
