"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
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
import { SidebarNav } from "@/components/sidebar"
import { useUser } from "@auth0/nextjs-auth0/client"

const profileFormSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: "name must be at least 2 characters.",
        }),
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

export default function Generate() {

    const { user } = useUser();

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
                    'traits': traitValue,
                    'user_email': user?.email
                }
            ])
            .select()

    }

    return (
        <div className="flex relative">
            <aside className="w-[200px] px-6 ">
                <SidebarNav items={sidebarNavItems} className="sticky top-0 mt-6" />
            </aside>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mx-10 px-20 py-6 w-full">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Character Name*</FormLabel>
                                <FormControl>
                                    <Input placeholder="kashayp123" {...field} />
                                </FormControl>
                                <FormDescription>
                                    this is the diaplay name of your character
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
                                <FormLabel>Comic Picture Style</FormLabel>
                                <FormControl>
                                    <Input placeholder="hyper-realistic" {...field} />
                                </FormControl>
                                <FormDescription>
                                    this is style of image you want to generate
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="accessory"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Accessory*</FormLabel>
                                <FormControl>
                                    <Input placeholder="glasses" {...field} />
                                </FormControl>
                                <FormDescription>
                                    type the accessory you want to add to your character.if there are mutiple the seperate value by comma and if there are nothing type "none"
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="ethnicity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ethnicity</FormLabel>
                                <FormControl>
                                    <Input placeholder="African" {...field} />
                                </FormControl>
                                <FormDescription>
                                    this is will be the ethnicity of your character
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select Age</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a age group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Age Group</SelectLabel>
                                            <SelectItem value="adolscent">Adolescent</SelectItem>
                                            <SelectItem value="young adult">Young-Adult</SelectItem>
                                            <SelectItem value="middle aged">Middle-Aged</SelectItem>
                                            <SelectItem value="old aged">Old-Aged</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Select the age group of your character
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
                                <FormLabel>Select Facial Hair</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select facial hair" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Facial hair</SelectLabel>
                                            <SelectItem value="clean shave">Clean Shave</SelectItem>
                                            <SelectItem value="thick bears">Thick Beard</SelectItem>
                                            <SelectItem value="mustache">Mustache</SelectItem>
                                            <SelectItem value="goatee">Goatee</SelectItem>
                                            <SelectItem value="stuble">Stuble</SelectItem>
                                            <SelectItem value="dutch beard">Dutch Beard</SelectItem>
                                            <SelectItem value="mutton chop">Mutton Chops</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Select facial hair for your character
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
                                            Traits
                                        </FormLabel>
                                        <FormDescription className={cn(index !== 0 && "sr-only")}>
                                            Add additional triat to your character.
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
                            Add any additoinal traits
                        </Button>
                    </div>
                    <Button >Add Character</Button>
                </form>
            </Form>
        </div>
    )
}