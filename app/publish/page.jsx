"use client"

import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { UploadButton, UploadDropzone } from "@/lib/uploadThing";

const Publish = () => {
    const [selectedImages, setSelectedImages] = useState([]);

    const handleFileChange = async (res) => {

        try {
            const imageUrl = res[0].url;
            setSelectedImages((prevImages) => [...prevImages, imageUrl]);
        } catch (error) {
            console.error('Error uploading image:', error.message);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                    handleFileChange(res);
                }}
                onUploadError={(error) => {
                    // Do something with the error.
                    alert(`ERROR! ${error.message}`);
                }}
            />
            {selectedImages.length > 0 && (
                <div className="flex flex-wrap">
                    {selectedImages.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt="uploaded image"
                            className="w-[350px] h-auto object-cover m-2"
                        />
                    ))}
                </div>
            )}
        </main>
    )
};

export default Publish;