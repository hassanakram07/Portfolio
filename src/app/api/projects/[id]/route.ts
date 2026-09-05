import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ProjectModel } from '@/models/Project'
import mongoose from 'mongoose'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase()
    const { id } = await params

    let project = null
    if (mongoose.Types.ObjectId.isValid(id)) {
      project = await ProjectModel.findById(id)
    }
    if (!project) {
      project = await ProjectModel.findOne({ slug: id })
    }

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase()
    const { id } = await params
    const body = await request.json()

    let project = null
    if (mongoose.Types.ObjectId.isValid(id)) {
      project = await ProjectModel.findByIdAndUpdate(id, body, { new: true })
    } else {
      project = await ProjectModel.findOneAndUpdate({ slug: id }, body, { new: true })
    }

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase()
    const { id } = await params

    let result = null
    if (mongoose.Types.ObjectId.isValid(id)) {
      result = await ProjectModel.findByIdAndDelete(id)
    } else {
      result = await ProjectModel.findOneAndDelete({ slug: id })
    }

    if (!result) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 })
  }
}
