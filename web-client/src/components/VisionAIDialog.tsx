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
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Markdown from 'react-markdown'
import { Textarea } from './ui/textarea';
import Spinner from './Spinner';

type VisionAIProps = {
    file_id: string;
    is_video: boolean;
    invalidate: () => void
}

const useCases = [
    {
        title: "Describe Video Content",
        description: "Generate a description of an video",
        prompt: "Generate a description of an video",
    },
    {
        title: "Summarize Video",
        description: "Summarize a video and extract important dialogue.",
        prompt: "Summarize a video and extract important dialogue.",
    },
    {
        title: "Hashtags for a video",
        description: "Generate hashtags for a video ad",
        prompt: "Generate hashtags for a video ad",
    },
];

type UseCaseButtonProps = {
    isSelected: boolean;
    title: string;
    description: string;
    onClick: () => void;
}

const UseCaseButton = ({ isSelected, title, description, onClick }: UseCaseButtonProps) => {
    return (
        <div onClick={onClick} className={"w-full h-24 flex flex-col border border-solid border-black cursor-pointer rounded-lg p-2"}>
            <h3 className="text-lg">{title}</h3>
            <p>{description}</p>
        </div>
    )
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
        if (!reader) return

        const readableStream = new ReadableStream({
            async start(controller) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value, { stream: true });
                    console.log(chunk);
                    const text = extractData(chunk);
                    console.log("extracted Data:\n", text);
                    // controller.enqueue(chunk);
                    setCompletion(c => c + text);
                }
                controller.close();
                reader.releaseLock();
            }
        })

        await new Response(readableStream).text();
    }

    const onGenerate = async () => {
        if(isGenerating) return;
        setIsGenerating(true);
        // Call the API to generate completion
        handleStreaming()
            .then(() => {
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
            <DialogContent>
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
                        <TabsList className="h-full flex flex-col" data-orientation="vertical">
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
                        <Label>Completion</Label>
                        <div className="w-full h-24 max-h-32 p-2 overflow-y-scroll">
                            <Markdown>{completion}</Markdown>
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