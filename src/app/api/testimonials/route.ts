import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { TestimonialModel } from '@/models/Testimonial'
import { ensureDatabaseSeeded } from '@/lib/db-init'

export async function GET() {
  try {
    await ensureDatabaseSeeded()
    await connectToDatabase()

    const testimonials = await TestimonialModel.find().sort({ display_order: 1 })
    return NextResponse.json(testimonials)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const body = await request.json()

    const testimonial = await TestimonialModel.create(body)
    return NextResponse.json(testimonial, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 })
  }
}
