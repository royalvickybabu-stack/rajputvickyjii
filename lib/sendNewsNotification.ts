import { prisma } from "@/lib/prisma";
import { webpush } from "@/lib/webpush";

export async function sendNewsNotification(
  title: string,
  slug: string
) {
  const subscriptions =
    await prisma.notificationSubscription.findMany();

  const notificationPayload = JSON.stringify({
    title: "🔔 लोक मचान पर नई खबर",
    body: title,
    url: `/news/${slug}`,
  });

  for (const subscription of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth,
          },
        },
        notificationPayload
      );
    } catch (error: any) {
      console.error(
        "Push notification error:",
        error?.statusCode || error
      );

      if (
        error?.statusCode === 404 ||
        error?.statusCode === 410
      ) {
        await prisma.notificationSubscription.delete({
          where: {
            id: subscription.id,
          },
        });
      }
    }
  }
}