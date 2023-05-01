import api from "../config/api";

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

export const unsubscribeAllNotifications = async () => {
  (await navigator.serviceWorker.getRegistrations()).forEach(async (registration) => {
    (await registration.pushManager.getSubscription())?.unsubscribe();
  });
};

export const subscribeNotifications = async (id: string) => {
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    (await navigator.serviceWorker.getRegistration())?.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY || "")
    }).then((subscription) => {
      console.log("Subscribed to push notifications!");
      console.log(subscription.toJSON());

      api.post("/subscriptions", { ...subscription.toJSON(), userId: id }).catch((err) => {
        subscription.unsubscribe();

        console.log("Failed to save subscription!");
        console.log(err);
      });
    }).catch((err) => {
      console.log("Failed to subscribe to push notifications!");
      console.log(err);
    });
  }
};
