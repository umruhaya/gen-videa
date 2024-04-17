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
import Markdown from "react-markdown";
import Spinner from "./Spinner";

type VisionCompletions = {
    id: number;
    created_at: string;
    user_email: string;
    category: string;
    completion: string;
}

export default function VisionAITab() {
    // Fetches Vision completions from the server and updates the UI state accordingly.

    const { data: completions, isLoading,  refetch: refetchCompletions } = useQuery<VisionCompletions[]>({
        queryKey: ["visionCompletions"],
        queryFn: () => axios.get("/api/vision/get-multimodal-completions").then(res => res.data),
    }, queryClient)

    return (
        <section className="bg-zinc-200 dark:bg-zinc-900 min-h-screen rounded-3xl pb-24 w-full px-8">
            <div className="w-full flex flex-col my-4 p-8">
                <h2 className="my-4 text-2xl font-bold">Vision AI</h2>
                <p className="text-md italic">View all your completions here</p>
            </div>
            {completions && completions.length === 0 && (
                <div className="flex justify-center w-full h-96">
                    <h2 className="text-xl font-semibold italic p-8">No Completions Found.</h2>
                </div>
            )}
            <div>
                {isLoading && <Spinner />}
                {completions?.map((completion, index) => (
                    <Accordion type="single" collapsible key={index}>
                        <AccordionItem value={completion.id.toString()}>
                            <AccordionTrigger>
                                <div className="flex justify-between w-full p-4">
                                    <h3 className="text-xl font-semibold">{completion.category}</h3>
                                    <h3 className="text-xl font-semibold">{(new Date(completion.created_at)).toLocaleString()}</h3>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="p-4">
                                    <Markdown className="prose lg:prose-xl">
                                        {completion.completion}
                                    </Markdown>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ))}
            </div>
        </section>
    )
}