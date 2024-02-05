import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req) {

    const { userEmail } = await req.json()

    const { data: characterInfo, error } = await supabase
        .from('character')
        .select('*')
        .eq('user_email', userEmail)

    return NextResponse.json({
        success: true,
        character: characterInfo
    })

}