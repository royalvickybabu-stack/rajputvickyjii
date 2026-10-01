import { NextResponse } from "next/server";

const PLAYLIST_ID = "PLDQg99UPqpXQ9INDP3H86aSJiJz6KaVvy";

type YouTubePlaylistItem = {
  contentDetails?: {
    videoId?: string;
  };
  snippet?: {
    title?: string;
    publishedAt?: string;
    thumbnails?: {
      high?: { url?: string };
      medium?: { url?: string };
      default?: { url?: string };
    };
  };
};

export async function GET() {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "YouTube API key configured नहीं है।" },
        { status: 500 }
      );
    }

    const url =
      "https://www.googleapis.com/youtube/v3/playlistItems" +
      `?part=snippet,contentDetails` +
      `&playlistId=${PLAYLIST_ID}` +
      `&maxResults=6` +
      `&key=${apiKey}`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("YouTube API error:", data);

      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            "YouTube videos fetch करने में समस्या हुई।",
        },
        { status: response.status }
      );
    }

    const videos = (data.items || [])
      .map((item: YouTubePlaylistItem) => {
        const videoId = item.contentDetails?.videoId;

        if (!videoId) {
          return null;
        }

        return {
          id: videoId,
          title: item.snippet?.title || "Podcast Video",
          thumbnail:
            item.snippet?.thumbnails?.high?.url ||
            item.snippet?.thumbnails?.medium?.url ||
            item.snippet?.thumbnails?.default?.url ||
            "",
          publishedAt: item.snippet?.publishedAt || "",
          url: `https://www.youtube.com/watch?v=${videoId}`,
        };
      })
      .filter(Boolean);

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Podcast API error:", error);

    return NextResponse.json(
      { error: "Podcast videos load करने में समस्या हुई।" },
      { status: 500 }
    );
  }
}

