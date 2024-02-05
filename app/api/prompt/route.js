import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate';

export async function POST(req) {

    const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
    });

    const { name, comicStyle, accessory, ethnicity, age, facialHair, traitsArray } = await req.json()

    const traits = Array(traitsArray).join(", ");

    const RAW_TEXT = `single character image named ${name} with image style of ${comicStyle}, accessories as ${accessory},ethnicity ${ethnicity}, age group ${age}, ${facialHair} beard style and traits are ${traits}.
    
    can you just rewrite this prompt properly for stable diffusion model. Don't include any greetings. answer shouldn't be in markdown format.don't include \n in the answer. don't include stable diffusion word in your answer. don't include any other text other than modified prompt in answer. don't write text like "Sure, here's a revised prompt" in the answer`

    const output = await replicate.run(
        "meta/llama-2-70b-chat",
        {
            input: {
                prompt: RAW_TEXT
            }
        }
    );

    return NextResponse.json({
        success: true,
        Completion: output.join("").replace("Sure, here's a revised prompt based on your description", "")
    })

}