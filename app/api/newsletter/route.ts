import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { email?: string; source?: string };
    const email = (body.email || "").trim().toLowerCase();

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const brevoKey = process.env.BREVO_API_KEY;
    if (!brevoKey) {
      return NextResponse.json(
        { error: "Newsletter service is temporarily unconfigured." },
        { status: 503 }
      );
    }

    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": brevoKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        updateEnabled: true,
        attributes: {
          SOURCE: body.source || "homepage_newsletter",
        },
      }),
    });

    if (!res.ok && res.status !== 204) {
      const errText = await res.text().catch(() => "");
      console.error("Brevo newsletter error:", res.status, errText);
      return NextResponse.json(
        { error: "Unable to complete subscription right now. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Subscribed! Watch your inbox for restock alerts and drop codes.",
    });
  } catch (error) {
    console.error("Newsletter POST error:", error);
    return NextResponse.json(
      { error: "Unable to process request right now." },
      { status: 500 }
    );
  }
}

