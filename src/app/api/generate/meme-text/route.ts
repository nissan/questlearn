import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { generateMemeWithTemplate } from '@/lib/meme-humour'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { topic, curriculumFact } = await req.json()
    if (!topic || !curriculumFact) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const result = await generateMemeWithTemplate(topic, curriculumFact)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[meme-text] error:', err)
    return NextResponse.json({ templateId: null, topText: null, bottomText: null })
  }
}
