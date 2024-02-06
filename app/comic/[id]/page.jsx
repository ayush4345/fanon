"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { useQuery } from 'react-query';
import axios from "axios";

export default function Comic({ params }) {

    console.log(params)

    const fetchData = async () => {
        const response = await axios.post(`/api/get-comic`, {
            comicId: params.id
        })

        if (response.status === 200 || response.status === 201) {
            return response.data
        }
    }

    const { isLoading, error, data: comicInfo, isFetching, refetch } = useQuery(["comic", params.id], fetchData, {
        enabled: true,
        refetchOnWindowFocus: true,
        retry: 2,
    })

    console.log(comicInfo?.comic[0].images)

    return (
        <main>
            <h1 className="text-2xl font-[Brootahh] font-medium w-full text-center mb-4">Your Comic Strip</h1>
            <ScrollArea className="h-[calc(100vh-200px)]">
                {(comicInfo && comicInfo?.comic.length > 0) && (
                    <div className="flex flex-col justify-center items-center gap-4 flex-wrap">
                        {comicInfo?.comic[0].images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt="comic image"
                                className="w-[450px] h-auto object-cover mb-2"
                            />
                        ))}
                    </div>
                )}
            </ScrollArea >
        </main>
    )
}