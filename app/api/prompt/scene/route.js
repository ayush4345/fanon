import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate';

export async function POST(req) {

    const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
    });

    const { character1, character2, interaction, background, time, style } = await req.json()

    const character1Traits = Array(character1.traits).join(", ");
    const character2Traits = Array(character2.traits).join(", ");

    const SCENE_TEXT = `Generate a scene image with the artistic style of ${style}. Introduce Character 1 adorned with ${character1.accessory}, belonging to the ethnicity ${character1.ethnicity}, in the age group ${character1.age}. Character 1 sports a ${character1.facialHair} beard style and possesses traits characterized by ${character1Traits}.

    Next, include Character 2 with accessories like ${character2.accessory}, reflecting ${character2.ethnicity} ethnicity, in the age group ${character2.age}. Character 2 features a ${character2.facialHair} beard style and exhibits traits described as ${character2Traits}.
    
    Portray both characters engaging in ${interaction} against the backdrop of ${background} during ${time}`

    let output = await replicate.run(
        "meta/llama-2-70b-chat",
        {
            input: {
                prompt: SCENE_TEXT
            }
        }
    );

    return NextResponse.json({
        success: true,
        Completion: output.join("").replace("Sure, here's a revised prompt based on your description", "")
    })

}