"use client"

import React, { useEffect } from 'react';
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
import { supabase } from "@/lib/supabase"
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

const profileFormSchema = z.object({
    character2: z.string(),
    character1: z.string(),
    comicStyle: z
        .string({ required_error: "Please type your preferred style." }),
    accessory: z.string().min(4),
    ethnicity: z.string().min(4),
    age: z.string({ required_error: "Please select a age group." }),
    facialHair: z.string({ required_error: "Please select a facial hair type" }),
    triats: z
        .array(
            z.object({
                value: z.string({ message: "Please enter a trait." }).min(2),
            })
        )
        .optional(),
})

const defaultValues = {
    comicStyle: "comic",
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

    const fetchData = async () => {
        const response = await axios.post(`http://localhost:3000/api/get-characters`, {
            userEmail: user?.email
        })

        if (response.status === 200 || response.status === 201) {
            return response.data
        }
    }

    const { isLoading, error, data: predictions, isFetching, refetch } = useQuery(["characters",user?.email], fetchData, {
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
        name: "traits",
        control: form.control,
    })

    async function onSubmit(data) {

        const traitValue = fields.map((field) => field.value)

        const { data: characterInfo, error } = await supabase
            .from('character')
            .insert([
                {
                    'comic_style': data.comicStyle,
                    'name': data.name,
                    'accessory': data.accessory,
                    'ethnicity': data.ethnicity,
                    'age_group': data.age,
                    'facial_hair': data.facialHair,
                    'traits': traitValue
                }
            ])
            .select()

    }

    return (
        <div className="flex relative">
            <aside className="w-[400px] px-6 ">
                <SidebarNav items={sidebarNavItems} className="sticky top-0 mt-6" />
            </aside>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mx-10 px-20 py-6 w-full">
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
                                            <SelectItem value="adolscent">Adolescent</SelectItem>
                                            <SelectItem value="young adult">Young-Adult</SelectItem>
                                            <SelectItem value="middle aged">Middle-Aged</SelectItem>
                                            <SelectItem value="old aged">Old-Aged</SelectItem>
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
                                            <SelectItem value="adolscent">Adolescent</SelectItem>
                                            <SelectItem value="young adult">Young-Adult</SelectItem>
                                            <SelectItem value="middle aged">Middle-Aged</SelectItem>
                                            <SelectItem value="old aged">Old-Aged</SelectItem>
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
                        name="facialHair"
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
                                            Add additional features to your image.
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
                    <Button type="submit">Add Character</Button>
                </form>
            </Form>
        </div>
    )
}

export default Story;