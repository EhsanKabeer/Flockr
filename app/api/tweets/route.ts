import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createTweetServer } from "@/lib/firebase/firestore-server";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { content?: string; imageUrl?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (!content) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  const imageUrl =
    typeof body.imageUrl === "string" && body.imageUrl.length > 0 ? body.imageUrl : undefined;

  try {
    const tweetId = await createTweetServer({
      userId: session.user.id,
      content,
      imageUrl,
    });
    return NextResponse.json({ id: tweetId });
  } catch (error) {
    console.error("Create tweet API error:", error);
    return NextResponse.json(
      { error: "Failed to create tweet" },
      { status: 500 }
    );
  }
}
