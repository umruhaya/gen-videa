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
import { isDalleGenerateDialogOpen, dalleGenerate } from '@/store';
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "./ui/toaster"

type DalleGenerateProps = {
    invalidate: () => void
}

export default function DalleGenerateDialog({ invalidate }: DalleGenerateProps) {

    const $isOpen = useStore(isDalleGenerateDialogOpen)
    const $dalle = useStore(dalleGenerate)
    const { toast } = useToast()

    const handleSubmit = async () => {
        if ($dalle.state === "generating") return

        dalleGenerate.set({ ...$dalle, state: "generating" })

        const response = await fetch("/api/openai/generate-dalle3-completion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: $dalle.prompt,
            }),
        })
        isDalleGenerateDialogOpen.set(false) // Added this so that the dialogue closes once generation is done/fails.
        //  While generation is happening, we see "Generating Image..."
        if (response.ok) {
            const data = await response.json()
            console.debug(data)
            dalleGenerate.set({ ...$dalle, state: "done" })
            toast({
                title: "DALL·E generation successful.",
                description: `Your image has been generated.`,
                action: (
                    <ToastAction altText="Ack">Ok</ToastAction>
                )
            })
            invalidate()
        } else {
            dalleGenerate.set({ ...$dalle, state: "error" })
            toast({
                title: "DALL·E generation failed.",
                description: `Your image could not be generated.`,
                action: (
                    <ToastAction altText="Ack">Ok</ToastAction>
                )
            })
        }
    }

    // https://www.radix-ui.com/primitives/docs/components/dialog#api-reference
    return (
        <Dialog open={$isOpen} onOpenChange={(open : any) => isDalleGenerateDialogOpen.set(open)}>
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
                {$dalle.state === "generating" && (
                    <div>Generating image...</div>
                )}
                <Label htmlFor="prompt">Prompt</Label>
                <Input id="prompt" value={$dalle.prompt} onChange={(e) => dalleGenerate.set({ ...$dalle, prompt: e.target.value })} />
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={$dalle.state === "generating"}>Generate</Button>
                </DialogFooter>
            </DialogContent>
            <Toaster />
        </Dialog>
    )
}