import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate';

export async function POST(req) {

    const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
    });

    const { prompt } = await req.json()

    const output = await replicate.run(
        "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        {
            input: {
                prompt: prompt,
                width: 640,
                height: 640,
                refine: "expert_ensemble_refiner"
            }
        }
    );

    return NextResponse.json({
        success: true,
        image: output[0]
    })

}