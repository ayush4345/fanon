import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req) {

    const { comicId } = await req.json()

    const { data: comicInfo, error } = await supabase
        .from('comics')
        .select('*')
        .eq('id', comicId)

    return NextResponse.json({
        success: true,
        comic: comicInfo
    })

}