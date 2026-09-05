import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { SiteSettingModel } from '@/models/SiteSetting'
import { ensureDatabaseSeeded } from '@/lib/db-init'

export async function GET() {
  try {
    await ensureDatabaseSeeded()
    await connectToDatabase()

    const settings = await SiteSettingModel.find()
    const heroRow = settings.find((s) => s.key === 'hero')?.value
    const aboutRow = settings.find((s) => s.key === 'about')?.value

    return NextResponse.json({
      hero: heroRow || null,
      about: aboutRow || null,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase()
    const { hero, about } = await request.json()

    if (hero) {
      await SiteSettingModel.findOneAndUpdate(
        { key: 'hero' },
        { value: hero },
        { upsert: true, new: true }
      )
    }

    if (about) {
      await SiteSettingModel.findOneAndUpdate(
        { key: 'about' },
        { value: about },
        { upsert: true, new: true }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 })
  }
}
