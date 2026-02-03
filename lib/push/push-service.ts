/**
 * Push Notification Service
 */

import { prisma } from '@/lib/prisma';

export async function subscribeToPush(
  userId: string,
  subscription: PushSubscription
): Promise<void> {
  await prisma.pushSubscription.upsert({
    where: { userId },
    update: {
      endpoint: subscription.endpoint,
      keys: JSON.stringify(subscription.toJSON().keys),
    },
    create: {
      userId,
      endpoint: subscription.endpoint,
      keys: JSON.stringify(subscription.toJSON().keys),
    },
  });
}

export async function sendPushNotification(
  userId: string,
  title: string,
  message: string,
  metadata?: any
): Promise<boolean> {
  const subscription = await prisma.pushSubscription.findUnique({
    where: { userId },
  });

  if (!subscription) return false;

  try {
    const webpush = require('web-push');

    const vapidKeys = {
      publicKey: process.env.VAPID_PUBLIC_KEY!,
      privateKey: process.env.VAPID_PRIVATE_KEY!,
    };

    webpush.setVapidDetails(
      'mailto:admin@nutrifitcoach.com',
      vapidKeys.publicKey,
      vapidKeys.privateKey
    );

    const payload = JSON.stringify({ title, message, metadata });

    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: JSON.parse(subscription.keys),
      },
      payload
    );

    return true;
  } catch (error) {
    console.error('Push error:', error);
    return false;
  }
}
