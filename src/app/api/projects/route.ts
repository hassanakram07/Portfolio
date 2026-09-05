import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ProjectModel } from '@/models/Project'
import { ensureDatabaseSeeded } from '@/lib/db-init'

export async function GET() {
  try {
    await ensureDatabaseSeeded()
    await connectToDatabase()

    const projects = await ProjectModel.find().sort({ display_order: 1 })
    return NextResponse.json(projects)
  } catch (err: any) {
    console.error('Fetch projects error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const body = await request.json()

    // Ensure slug uniqueness
    const existing = await ProjectModel.findOne({ slug: body.slug })
    if (existing) {
      body.slug = `${body.slug}-${Date.now().toString(36)}`
    }

    const project = await ProjectModel.create(body)
    return NextResponse.json(project, { status: 201 })
  } catch (err: any) {
    console.error('Create project error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to create project' },
      { status: 500 }
    )
  }
}
