"use client"

import React, { useEffect, useRef, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { SidebarNav } from '@/components/sidebar';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useUser } from "@auth0/nextjs-auth0/client"
import { useQuery } from 'react-query';
import axios from 'axios';
import Bubble from '@/components/speechBubble/bubble';
import html2canvas from 'html2canvas';
import { Textarea } from '@/components/ui/textarea';
import ElectricBubble from '@/components/speechBubble/electricBubble';

const profileFormSchema = z.object({
    character2: z.string().optional(),
    character1: z.string({ required_error: "Please select a character" }),
    interaction: z
        .string({ required_error: "Please type interaction between character" }),
    background: z.string({ required_error: "Please type backgroud for the scene." }).min(4),
    time: z.string({ required_error: "Please select a time" }),
    comicStyle: z.string({ required_error: "Please select a style for image" }),
    features: z
        .array(
            z.object({
                value: z.string({ message: "Please enter a feature." }).min(2),
            })
        )
        .optional(),
})

const defaultValues = {
    character2: "none",
}

const sidebarNavItems = [
    {
        title: "Character",
        href: "/generate/character",
    },
    {
        title: "Story",
        href: "/generate/story",
    },
]

function Story() {

    const { user } = useUser();
    const [data, setData] = useState(null)
    const [text, setText] = useState("")
    const containerRef = useRef(null);

    function handleOnDrag(e) {
        e.dataTransfer.setData("bubble", e.target.id);
    }

    const fetchData = async () => {
        const response = await axios.post(`/api/get-characters`, {
            userEmail: user?.email
        })

        if (response.status === 200 || response.status === 201) {
            return response.data
        }
    }

    const { isLoading, error, data: charactersInfo, isFetching, refetch } = useQuery(["characters", user?.email], fetchData, {
        enabled: true,
        refetchOnWindowFocus: true,
        retry: 2,
    })

    const form = useForm({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
        mode: "onChange",
    })

    const { fields, append } = useFieldArray({
        name: "features",
        control: form.control,
    })

    let SCENE_TEXT;

    const fetchSceneImage = async () => {
        const response = await axios.post(`/api/generate-image`, {
            prompt: SCENE_TEXT
        })

        if (response.status === 200 || response.status === 201) {
            return response.data
        }
    }

    const { isLoading: loadingImage, data: sceneImage, isFetching: fetchingImage, refetch: generateImage } = useQuery(["scene"], fetchSceneImage, {
        enabled: false,
        refetchOnWindowFocus: false,
        retry: 2,
    })

    async function onSubmit(data) {

        const character1 = charactersInfo?.characters.find(character => character.name === data.character1)
        const character2 = charactersInfo?.characters.find(character => character.name === data.character2)

        const character1Traits = character1.traits.join(",")
        if (character2) {
            const character2Traits = character2.traits.join(",")

            SCENE_TEXT = `Generate a scene image  with the artistic style of ${data.comicStyle} portraying two characters engaging in ${data.interaction} against the backdrop of ${data.background} during ${data.time}. Introduce Character 1 adorned with ${character1.accessory}, belonging to the ethnicity ${character1.ethnicity}, in the age group ${character1.age}. Character 1 sports a ${character1.facialHair} beard style and possesses traits characterized by ${character1Traits}.
                          also, include Character 2 in scene with accessories like ${character2.accessory}, reflecting ${character2.ethnicity} ethnicity, in the age group ${character2.age}. Character 2 features a ${character2.facialHair} beard style and exhibits traits described as ${character2Traits}.
                         `
        } else {
            SCENE_TEXT = `Generate a scene image with the artistic style of ${data.comicStyle}. Introduce Character 1 adorned with ${character1.accessory}, belonging to the ethnicity ${character1.ethnicity}, in the age group ${character1.age_group}. Character 1 sports a ${character1.facial_hair} beard style and possesses traits characterized by ${character1Traits}.
                          Portray the character engaging in ${data.interaction} against the backdrop of ${data.background} during ${data.time}`
        }

        await generateImage()
    }

    function handleOnDrop(e) {
        const widget = e.dataTransfer.getData("bubble")
        const coordinate = {
            x: e.clientX,
            y: e.clientY
        }
        setData({ widget: widget, coordinate: coordinate })
    }
    console.log(data)

    function handleDragOver(e) {
        e.preventDefault()
    }

    const captureScreenshot = () => {
        if (containerRef.current) {
            html2canvas(containerRef.current, {
                useCORS: true, // Enable CORS support for cross-origin images
            }).then((canvas) => {
                // Convert canvas to an image and open in a new tab or save to a file
                const screenshot = canvas.toDataURL('image/png');
                window.open(screenshot, '_blank');
            });
        }
    };

    return (
        <div className="flex">
            <aside className="w-[200px] px-6 ">
                <SidebarNav items={sidebarNavItems} className="sticky top-0 mt-6" />
            </aside>
            <ResizablePanelGroup
                direction="horizontal"
                className=""
            >
                <ResizablePanel defaultSize={60} className='px-6'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6 w-full">
                            <div className='flex gap-20 w-full'>
                                <FormField
                                    control={form.control}
                                    name="character1"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select character 1" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Character 1</SelectLabel>
                                                    {charactersInfo?.characters?.map((character) => <SelectItem value={character.name}>{character.name}</SelectItem>)}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="character2"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select character 2" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Character 2</SelectLabel>
                                                    <SelectItem value="none">None</SelectItem>
                                                    {charactersInfo?.characters?.map((character) => <SelectItem value={character.name}>{character.name}</SelectItem>)}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="interaction"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Interaction</FormLabel>
                                        <FormControl>
                                            <Input placeholder="talking" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            what type of interaction are characters doing
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="background"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Background</FormLabel>
                                        <FormControl>
                                            <Input placeholder="forest" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            what type of background are characters in
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="time"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Select Time</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a time" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Time</SelectLabel>
                                                    <SelectItem value="day">Day</SelectItem>
                                                    <SelectItem value="afternoon">Afternoon</SelectItem>
                                                    <SelectItem value="evening">Evening</SelectItem>
                                                    <SelectItem value="night">Night</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Select the time for the story
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="comicStyle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Select Image Style</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Style" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Style</SelectLabel>
                                                    <SelectItem value="water color">Water Coloring</SelectItem>
                                                    <SelectItem value="manga">Manga</SelectItem>
                                                    <SelectItem value="cartoon">Cartoon</SelectItem>
                                                    <SelectItem value="pixel art">Pixel Art</SelectItem>
                                                    <SelectItem value="realistic">Realistic</SelectItem>
                                                    <SelectItem value="comic">Comic</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Select image style for comic
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div>
                                {fields.map((field, index) => (
                                    <FormField
                                        control={form.control}
                                        key={field.id}
                                        name={`traits.${index}.value`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={cn(index !== 0 && "sr-only")}>
                                                    Features
                                                </FormLabel>
                                                <FormDescription className={cn(index !== 0 && "sr-only")}>
                                                    Add additional features for your image.
                                                </FormDescription>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => append({ value: "" })}
                                >
                                    Add any additoinal features
                                </Button>
                            </div>
                            <Button disabled={fetchingImage ? true : false}>{fetchingImage ? "Generating ..." : "Generate image"}</Button>
                        </form>
                    </Form>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={40}>
                    <div className='pl-6 pr-4 mb-2'>
                        <h1 className='text-2xl font-semibold mt-6 mb-1'>Story Image</h1>
                        <h3 className='text-sm text-gray-500 mb-5'>click the screenshot of the scene once you are done. you can later upload all picture at once on <a href="/publish "target="_blank" className='text-blue-400 underline'>publish</a> page and publish on the internet</h3>
                        <div ref={containerRef} >
                            {sceneImage && (
                                <div className='rounded-md border-2 p-2 w-96 h-96 overflow-hidden' onDrop={(e) => handleOnDrop(e)} onDragOver={(e) => handleDragOver(e)}>
                                    <img src={sceneImage?.image} className='' />
                                </div>
                            )
                            }
                            {data
                                ? (data?.widget == "speech-bubble"
                                    ? <div id="speech-bubble" draggable onDragStart={(e) => handleOnDrag(e)} className='w-fit' style={{ position: 'absolute', left: data?.coordinate.x, top: data?.coordinate.y }}>
                                        <Bubble text={text} />
                                    </div>
                                    : <div id="electric-bubble" draggable onDragStart={(e) => handleOnDrag(e)} className='w-fit' style={{ position: 'absolute', left: data?.coordinate.x, top: data?.coordinate.y }}>
                                        <ElectricBubble text={text} />
                                    </div>
                                )
                                : <></>
                            }
                        </div>
                        <div className='flex gap-10 mt-6'>
                            <div id="speech-bubble" draggable onDragStart={(e) => handleOnDrag(e)} >
                                <Bubble text={text} />
                            </div>
                            <div id="electric-bubble" draggable onDragStart={(e) => handleOnDrag(e)} >
                                <ElectricBubble text={text} />
                            </div>
                        </div>
                        <Textarea value={text} onChange={(e) => setText(e.target.value)} className="my-3" placeholder="enter your dialogue" />
                        <Button onClick={() => setData(null)}>Reset</Button>
                    </div>
                </ ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}

export default Story;