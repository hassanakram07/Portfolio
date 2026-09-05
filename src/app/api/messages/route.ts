import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { MessageModel } from '@/models/Message'

export async function GET() {
  try {
    await connectToDatabase()
    const messages = await MessageModel.find().sort({ createdAt: -1 })
    return NextResponse.json(messages)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 })
  }
}
