import { NextResponse } from "next/server";
import { runAudit } from "@/lib/audit";
import { isValidUrl, isPrivateUrl } from "@/lib/utils";

export const maxDuration = 60;

export async function POST(request: Request) {
  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body", code: "INVALID_URL" },
      { status: 400 }
    );
  }

  const { url } = body;

  if (!url || typeof url !== "string") {
    return NextResponse.json(
      { error: "A URL is required.", code: "INVALID_URL" },
      { status: 400 }
    );
  }

  const normalizedUrl = url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}`;

  if (!isValidUrl(normalizedUrl)) {
    return NextResponse.json(
      { error: "Please enter a valid http or https URL.", code: "INVALID_URL" },
      { status: 400 }
    );
  }

  if (isPrivateUrl(normalizedUrl)) {
    return NextResponse.json(
      {
        error: "Auditing private/localhost URLs is not allowed.",
        code: "INVALID_URL",
      },
      { status: 400 }
    );
  }

  try {
    const result = await runAudit(normalizedUrl);
    return NextResponse.json(result);
  } catch (err) {
    const e = err as Error & { code?: string };
    const code = e.code ?? "UNKNOWN";

    if (code === "TIMEOUT") {
      return NextResponse.json(
        {
          error:
            "The page took too long to load. It may be slow or blocking automated access.",
          code: "TIMEOUT",
        },
        { status: 504 }
      );
    }

    if (
      e.message?.includes("403") ||
      e.message?.includes("blocked") ||
      e.message?.includes("Cloudflare")
    ) {
      return NextResponse.json(
        {
          error:
            "This site appears to block automated browsers. Try a different URL.",
          code: "BOT_BLOCKED",
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      {
        error: e.message || "An unexpected error occurred during the audit.",
        code: "UNKNOWN",
      },
      { status: 500 }
    );
  }
}
