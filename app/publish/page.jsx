"use client"

import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { UploadButton, UploadDropzone } from "@/lib/uploadThing";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Input } from "@/components/ui/input";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const Publish = () => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [publishedComic, setPublishedComic] = useState(null)
    const [name, setName] = useState("")
    const [copied, setCopied] = useState(false);
    const [publishing, setPublishing] = useState(false)

    const { user } = useUser();

    const handleFileChange = async (res) => {
        try {
            const imageUrl = res[0].url;
            setSelectedImages((prevImages) => [...prevImages, imageUrl]);
        } catch (error) {
            console.error('Error uploading image:', error.message);
        }
    };

    const handleCopyText = () => {
        const textToCopy = `https://fanon-eight.vercel.app/comic/${publishedComic[0]?.id}`;
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500); // Reset copied state after 1.5 seconds
            })
            .catch(err => console.error('Failed to copy:', err));
    };

    const publishHandler = async () => {
        if (selectedImages.length > 0 && user) {
            setPublishing(true)

            const { data, error } = await supabase
                .from('comics')
                .insert([
                    { images: selectedImages, author: user?.name, comic_name: name },
                ])
                .select()

            setPublishedComic(data)
            setPublishing(false)
        } else {
            alert(`ERROR! There are no images to publish or you are not logged in`);
        }
    }

    return (
        <main className="flex flex-col items-center px-10">
            <div className="flex justify-between items-center w-full">
                <h1 className="text-2xl font-semibold text-left w-full pl-0 pt-6 mb-6">Let's Publish Your Comic</h1>
                <Button disabled={publishing ? true : false} onClick={publishHandler}>{publishing ? "Publishing..." : "Publish"}</Button>
            </div>
            <section className="flex w-full gap-10">
                <div>
                    <div className="p-6 bg-gray-100 rounded-md shadow-md flex flex-col gap-5 h-fit">
                        <Input placeholder="enter your comic title" value={name} onChange={(e) => setName(e.target.value)} />
                        <p>Upload the screenshot for your comic Strip</p>
                        <UploadDropzone
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                                handleFileChange(res);
                            }}
                            onUploadError={(error) => {
                                // Do something with the error.
                                alert(`ERROR! ${error.message}`);
                            }}
                        />
                    </div>
                    {publishedComic && (
                        <Alert variant="success" className="mt-6 bg-green-50/50">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription className="relative">
                                Your Comic have been successfully published. Share the url with your friend
                                <div className="border-[1px] border-green-400 rounded-md px-1 py-2 relative">
                                    <span className="-z-10">https://fanon-eight.vercel.app/comic/{publishedComic[0]?.id}</span>{" "}
                                    <button className="z-10 bg-green-200 hover:bg-hover-300 px-2 py-1 rounded-lg absolute right-3 top-1" onClick={handleCopyText}>
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
                <ScrollArea className="rounded-md border w-3/4 h-[calc(100vh-200px)]">
                    <h1 className=" sticky top-0 text-2xl font-[Brootahh] font-medium w-full text-center mb-4">Your Comic Strip</h1>
                    {selectedImages.length > 0 && (
                        <div className="flex flex-col justify-center items-center gap-4 flex-wrap">
                            {selectedImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt="uploaded image"
                                    className="w-[450px] h-auto object-cover mb-1"
                                />
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </section>

        </main>
    )
};

export default Publish;