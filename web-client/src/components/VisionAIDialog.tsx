import { useStore } from '@nanostores/react';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { $isVisionAIDialogOpen } from '@/store';
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { queryClient } from '@/store/query-client';
import { Toaster } from "./ui/toaster"
import { useEffect, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Markdown from 'react-markdown'
import { Textarea } from './ui/textarea';
import Spinner from './Spinner';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

type VisionAIProps = {
    file_id: string;
    is_video: boolean;
    invalidate: () => void
}

const videoChapterPrompt = `Chapterize the video content by grouping the video content into chapters and providing summary for each chapter. Please only capture key events and highlights. If you are not sure about any info, please do not make it up. Be Creative with the Chapter Names and Make use appropriate time stamps according to the video size. Return the result in markdown format with chapter names in the following markdown like format:

### Chapter 1: [Chapter Name Here]

**Timecode:** _00:00-00:16_

#### Chapter Summary:

The video opens with [further video details]

### Chapter 2: [Chapter Name Here]

**Timecode:** _00:16-00:39_

#### Chapter Summary:

The video shifts its focus to [further details]



Go ahead and start chapterizing the video content.
`

const useCases = [
    {
        title: "Describe Video Content",
        description: "Generate a description of an video",
        prompt: "Write a detailed description for this video",
    },
    {
        title: "Summarize Video",
        description: "Summarize a video and extract important dialogue.",
        prompt: "Summarize a video and extract important dialogue.",
    },
    {
        title: "Hashtags for a video",
        description: "Generate hashtags for a video ad",
        prompt: "Generate 5-10 hashtags that relates to the content video. Try use more popular and engaging terms if possible e.g. #Viral Do not make up things not related to the video.",
    },
    {
        title: "Create Chapter Summary",
        description: "Group the video content into chapters with summary",
        prompt: videoChapterPrompt,
    }
];

type UseCaseButtonProps = {
    isSelected: boolean;
    title: string;
    description: string;
    onClick: () => void;
}

type CompletionMutationParams = {
    file_ids: string[];
    category: string;
    completion: string;
    client_locale_time: string;
}

function extractData(inputString: string) {
    return inputString
        .replaceAll("\n\ndata:", "")
        .slice(5, -2)
}

export default function VisionAIDialog({ file_id, is_video, invalidate }: VisionAIProps) {

    const [activeUseCaseIdx, setActiveUseCaseIdx] = useState("0");
    const [completion, setCompletion] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const isOpen = useStore($isVisionAIDialogOpen)
    const completionBoxInputRef = useRef<HTMLDivElement>(null)

    const completionMutation = useMutation({
        mutationKey: ["generate-multimodal-response"],
        mutationFn: ({ file_ids, category, completion, client_locale_time }: CompletionMutationParams) => axios.post('/api/vision/create-mulitmodal-completion', {
            file_ids,
            category,
            completion,
            client_locale_time,
        }),
    }, queryClient)

    function scrollToCompletionBoxBottom() {
        const scrollElement = completionBoxInputRef.current;
        if (scrollElement) {
            scrollElement.scrollTo({
                top: scrollElement.scrollHeight,
                behavior: "auto"
            });
        }
    }

    const handleStreaming = async () => {
        const response = await fetch("/api/vision/generate-multimodal-response", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                file_ids: [file_id],
                prompt: useCases[parseInt(activeUseCaseIdx)].prompt,
            }),
        });
        const reader = response.body?.getReader();
        const decoder = new TextDecoder()
        if (!reader) return "";

        let localCompletion = "";

        const readableStream = new ReadableStream({
            async start(controller) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value, { stream: true });
                    const text = extractData(chunk);
                    // controller.enqueue(chunk);
                    localCompletion += text;
                    setCompletion(c => c + text);
                }
                controller.close();
                reader.releaseLock();
            }
        })

        const tr = await new Response(readableStream).text();

        return localCompletion;
    }

    useEffect(() => {
        scrollToCompletionBoxBottom();
    }, [completion])

    const onGenerate = async () => {
        if (isGenerating) return;
        setIsGenerating(true);
        setCompletion("");
        // Call the API to generate completion
        handleStreaming()
            .then((completion) => {
                console.debug(completion);
                completionMutation.mutate({
                    file_ids: [file_id],
                    category: useCases[parseInt(activeUseCaseIdx)].title,
                    completion,
                    client_locale_time: new Date().toISOString(),
                })
                invalidate();
            })
            .catch(console.error)
            .finally(() => setIsGenerating(false));
    }

    // https://www.radix-ui.com/primitives/docs/components/dialog#api-reference
    return (
        <Dialog open={isOpen} onOpenChange={(open: any) => $isVisionAIDialogOpen.set(open)}>
            <DialogTrigger>
                <Button>Create Completion</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] max-w-[60vw]">
                <DialogHeader>
                    <DialogTitle>Vision AI</DialogTitle>
                    <DialogDescription>
                        Ask Question From AI regarding images and videos
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <h2>Select a Use Case</h2>
                    {/* https://www.radix-ui.com/primitives/docs/components/tabs#api-reference */}
                    <Tabs value={activeUseCaseIdx} onValueChange={setActiveUseCaseIdx} className="" orientation="vertical">
                        <TabsList className="h-full flex flex-col my-4" data-orientation="vertical">
                            {
                                useCases.map((useCase, idx) => (
                                    <TabsTrigger key={idx} value={idx.toString()} className="px-4 py-2 w-full justify-start">
                                        <h2 className="font-bold mr-1">{useCase.title}: </h2>
                                        <p>{useCase.description}</p>
                                    </TabsTrigger>
                                ))
                            }
                        </TabsList>
                    </Tabs>
                    <div>
                        <Label className="text-xl font-bold py-2">Completion</Label>
                        <hr />
                        <div ref={completionBoxInputRef} className="w-full h-64 max-h-32 p-2 overflow-y-scroll">
                            <div className="prose">
                                <Markdown>{completion}</Markdown>
                            </div>
                            {/* <Textarea
                                className=''
                                value={completion}
                                readOnly
                                /> */}
                        </div>

                        <Button onClick={onGenerate} disabled={isGenerating}>
                            {isGenerating ? <Spinner /> : "Generate"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
            <Toaster />
        </Dialog>
    )
}