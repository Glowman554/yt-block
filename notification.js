export function notification(title, message, icon) {
	return new Promise((resolve, reject) => {
		Notification.requestPermission(function() {
			if (Notification.permission === 'granted') {
				new Notification(title, { body: message, icon: icon, requireInteraction: false, silent: true });
				resolve();
			} else if (Notification.permission === 'denied') {
				reject('User denied the request for notifications.');
			} else { // Notification.permission === 'default'
				reject('User did not approve the request for notifications.');
			}
		});
	});
}