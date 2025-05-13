self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    const urlToOpen = event.notification.data?.url || '/'; // Fallback if no URL
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            return clients.openWindow(urlToOpen);
        })
    );
});
