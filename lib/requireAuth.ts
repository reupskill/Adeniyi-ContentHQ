import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function requireAuth() {
  const session = await auth()
  if (
    !session?.user?.email ||
    session.user.email !== process.env.AUTHORISED_EMAIL
  ) {
    return {
      error: NextResponse.json({ error: "Unauthorised" }, { status: 401 }),
    }
  }
  return { session }
}
