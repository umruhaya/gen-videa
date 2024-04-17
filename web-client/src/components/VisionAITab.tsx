import VisionAIDialog from "@/components/VisionAIDialog";
import { queryClient } from "@/store/query-client";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

type VisionCompletions = {
    id: number;
    created_at: string;
    user_email: string;
    category: string;
    completion: string;
}

export default function VisionAITab() {

    const { data, refetch: refetchCompletions } = useQuery<VisionCompletions[]>({
        queryKey: ["visionCompletions"],
        queryFn: () => axios.get("/api/vision/get-multimodal-completions").then(res => res.data),
    }, queryClient)

    return (
        <section className="bg-zinc-200 dark:bg-zinc-900 min-h-screen rounded-3xl pb-24 w-full px-8">
            <div className="w-full flex justify-between my-4">
                <h2 className="my-4 text-2xl font-bold p-8">Vision AI</h2>
            </div>
            {data && data.length === 0 && (
                <div className="flex justify-center w-full h-96">
                    <h2 className="text-xl font-semibold italic p-8">No media found.</h2>
                </div>
            )}
            <div>
                {/* something in place of bentogrid */}
            </div>
        </section>
    )
}