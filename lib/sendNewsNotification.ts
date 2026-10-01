import { prisma } from "@/lib/prisma";
import { webpush } from "@/lib/webpush";

export async function sendNewsNotification(
  title: string,
  slug: string
) {
  const subscriptions =
    await prisma.notificationSubscription.findMany();

  const notificationPayload = JSON.stringify({
    title: "ðŸ”” à¤²à¥‹à¤• à¤®à¤šà¤¾à¤¨ à¤ªà¤° à¤¨à¤ˆ à¤–à¤¬à¤°",
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
    } catch (error: unknown) {
      const statusCode =
        error &&
        typeof error === "object" &&
        "statusCode" in error &&
        typeof error.statusCode === "number"
          ? error.statusCode
          : undefined;

      console.error(
        "Push notification error:",
        statusCode || error
      );

      if (
        statusCode === 404 ||
        statusCode === 410
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

