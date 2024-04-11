// UI component for generating images with DALL·E using a dialog interface.
// Utilizes nanostores for state management and Radix UI for the dialog component.

import { useStore } from '@nanostores/react';
import { Button } from "@/components/ui/button";
import { Progress } from '@/components/ui/progress';
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
import { $isDalleGenerateDialogOpen, $dalleGenerate } from '@/store';
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "./ui/toaster"

// Type definition for props accepted by the DalleGenerateDialog component.
// Includes a function to invalidate cache or refresh data upon successful image generation.

type DalleGenerateProps = {
    invalidate: () => void
}

// Defines the dialog component for DALL·E image generation.
// Manages dialog state, input for text prompts, and handles image generation logic.

export default function DalleGenerateDialog({ invalidate }: DalleGenerateProps) {

    // Hooks to access and subscribe to the global state for dialog visibility and generation status.

    const isOpen = useStore($isDalleGenerateDialogOpen)
    const dalle = useStore($dalleGenerate)
    const { toast } = useToast()

    // Handles the image generation process. Prevents multiple submissions and updates the UI and state based on the operation's success or failure.

    const handleSubmit = async () => {

        // Initiates a POST request to the server for DALL·E image generation with the current prompt.

        if (dalle.state === "generating") return

        $dalleGenerate.set({ ...dalle, state: "generating" })

        const response = await fetch("/api/openai/generate-dalle3-completion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: dalle.prompt,
            }),
        })
        $isDalleGenerateDialogOpen.set(false) // Added this so that the dialogue closes once generation is done/fails.
        //  While generation is happening, we see "Generating Image..."
        if (response.ok) {
            const data = await response.json()
            console.debug(data)
            $dalleGenerate.set({ ...dalle, state: "done" })
            toast({
                title: "DALL·E generation successful.",
                description: `Your image has been generated.`,
                action: (
                    <ToastAction altText="Ack">Ok</ToastAction>
                )
            })
            invalidate()
        } 
        // Handles errors in image generation by updating state to error and displaying a failure toast notification.
        else {
            $dalleGenerate.set({ ...dalle, state: "error" })
            toast({
                title: "DALL·E generation failed.",
                description: `Your image could not be generated.`,
                action: (
                    <ToastAction altText="Ack">Ok</ToastAction>
                )
            })
        }
    }
    // Renders the dialog component with content for initiating DALL·E image generation.
    // Includes input for prompts and buttons for submitting the generation request.
    // https://www.radix-ui.com/primitives/docs/components/dialog#api-reference
    return (
        <Dialog open={isOpen} onOpenChange={(open : any) => $isDalleGenerateDialogOpen.set(open)}>
            <DialogTrigger>
                <Button>Generate</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate Images</DialogTitle>
                    <DialogDescription>
                        Unleash the power of DALL·E to generate images from text prompts.
                    </DialogDescription>
                </DialogHeader>
                // Conditionally displays a loading message when the image is being generated.
                {dalle.state === "generating" && (
                    <div>Generating image...</div>
                )}
                // Input field for entering the text prompt for DALL·E image generation.
                <Label htmlFor="prompt">Prompt</Label>
                <Input id="prompt" value={dalle.prompt} onChange={(e) => $dalleGenerate.set({ ...dalle, prompt: e.target.value })} />
                // Footer containing the generate button, disabled during the image generation process.
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={dalle.state === "generating"}>Generate</Button>
                </DialogFooter>
            </DialogContent>
            <Toaster />
        </Dialog>
    )
}