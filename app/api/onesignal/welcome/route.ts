import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Missing subscriptionId' }, { status: 400 });
    }

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Basic os_v2_app_cevzy2lmofcl5c2bnndri53sv2siv62wf3mun24omum55ks3qc7j2zwnpqiw6w2qge6z6j7kmzavsyobz33e5cewi2duhwji5xvvxcq`
      },
      body: JSON.stringify({
        app_id: "112b9c69-6c71-44be-8b41-6b47147772ae",
        include_subscription_ids: [subscriptionId],
        headings: { en: "Here is your ₹150 OFF! 🎉" },
        contents: { en: "Use code WELCOME15 on orders above ₹499. Valid for 6 hours only. Shop now!" },
        url: "https://www.octopusperfume.in"
      })
    });

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
