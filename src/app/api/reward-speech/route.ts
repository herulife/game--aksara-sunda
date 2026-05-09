import { NextRequest, NextResponse } from "next/server";

const DEFAULT_MODEL = "gpt-4o-mini-tts";
const DEFAULT_VOICE = "marin";
const DEFAULT_INSTRUCTIONS =
  "Speak in warm, cheerful Sundanese for a children's educational game. Keep the delivery natural, friendly, and encouraging.";

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY belum diatur di server." },
      { status: 503 },
    );
  }

  let payload: { message?: string };

  try {
    payload = (await request.json()) as { message?: string };
  } catch {
    return NextResponse.json({ error: "Payload audio tidak valid." }, { status: 400 });
  }

  const message = payload.message?.trim();

  if (!message) {
    return NextResponse.json({ error: "Pesan audio kosong." }, { status: 400 });
  }

  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_TTS_MODEL || DEFAULT_MODEL,
      voice: process.env.OPENAI_TTS_VOICE || DEFAULT_VOICE,
      input: message,
      instructions: process.env.OPENAI_TTS_INSTRUCTIONS || DEFAULT_INSTRUCTIONS,
      response_format: "mp3",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      {
        error: "Gagal membuat suara AI.",
        details: errorText,
      },
      { status: 502 },
    );
  }

  const audioBuffer = await response.arrayBuffer();

  return new NextResponse(audioBuffer, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
    },
  });
}
