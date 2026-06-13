import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getSupabase() {
  // ВРЕМЕННО: хардкод для теста
  const url = "https://ojhkxahzyzarpqtnmsxh.supabase.co";
  const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qaGt4YWh6eXphcnBxdG5tc3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNjA4NzIsImV4cCI6MjA5NjkzNjg3Mn0.tIsKmoZdIou1Z2uq7OQqnrTJUbwnatdTCemi2pyFC8Y";
  
  console.log("Supabase connection check (hardcoded):", { url: !!url, key: !!key });
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Server isn't configured yet. Missing Supabase credentials." },
      { status: 500 }
    );
  }

  // Попробуем вставить
  const { data, error: insertError } = await supabase
    .from("waitlist")
    .insert({ email })
    .select();

  // Логируем ошибку подробно
  if (insertError) {
    console.error("Supabase insert error:", insertError);
    console.error("Error code:", insertError.code);
    console.error("Error message:", insertError.message);
    console.error("Error details:", insertError.details);
    
    if (insertError.code === "23505") {
      return NextResponse.json({ error: "You're already on the list." }, { status: 409 });
    }
    
    return NextResponse.json(
      { error: `Database error: ${insertError.message}` }, 
      { status: 500 }
    );
  }

  console.log("Successfully inserted:", data);

  // Notify the site owner
  await notifyOwner(email);

  return NextResponse.json({ ok: true }, { status: 200 });
}

async function notifyOwner(email: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.NOTIFY_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "Flashy <onboarding@resend.dev>";

  if (!apiKey || !ownerEmail) return;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: fromEmail,
      to: ownerEmail,
      subject: "New Flashy waitlist signup",
      text: `A new person joined the Flashy waitlist:\n\n${email}`,
    });
  } catch (err) {
    console.error("Failed to send waitlist notification email:", err);
  }
}