import { useStore } from '@nanostores/react';
import { Button } from "@/components/ui/button";
import { Progress } from '@/components/ui/progress';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { isFileUploadDialogOpen, fileUpload } from '@/store';
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "./ui/toaster"

export default function FileUploadDialog() {

    const $isOpen = useStore(isFileUploadDialogOpen)
    const $fileUpload = useStore(fileUpload)
    const { toast } = useToast()

    const handleFileUpload = async () => {
        if (!$fileUpload) return
        if ($fileUpload.state === "uploading") return

        fileUpload.set({ ...$fileUpload, state: "uploading" })

        toast({
            title: "File upload started.",
            description: `Your file "${$fileUpload.file.name}" has started uploading.`,
            action: (
                <ToastAction altText="Ack">Ok</ToastAction>
            )
        })

        const response = await fetch("/api/files/create-file-upload-url", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                human_name: $fileUpload.file.name,
                extension: "." + ($fileUpload.file.name.split(".").pop() ?? "bin"),
            }),
        })
        const url = (await response.json())["url"] as string

        console.debug(url)

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                fileUpload.set({ ...$fileUpload, progress: percentComplete });
            }
        });

        xhr.onload = () => {
            fileUpload.set({ ...$fileUpload, state: xhr.status === 200 ? "done" : "error" })
            if (xhr.status === 200) {
                toast({
                    title: "File uploaded.",
                    description: `Your file was uploaded successfully.`,
                    action: (
                        <ToastAction altText="Ack">Ok</ToastAction>
                    )
                })
                fileUpload.set(null)
                isFileUploadDialogOpen.set(false)
            } else {
                toast({
                    title: "File upload failed.",
                    description: `Your file failed to upload.`,
                    action: (
                        <ToastAction altText="Ack">Ok</ToastAction>
                    )
                })
            }
        };

        xhr.onerror = (e) => {
            // console.error(e.er)
        }

        xhr.open('PUT', url, true);
        xhr.setRequestHeader('Content-Type', $fileUpload.file.type);
        xhr.send($fileUpload.file);
    };

    // https://www.radix-ui.com/primitives/docs/components/dialog#api-reference
    return (
        <Dialog open={$isOpen} onOpenChange={(open) => isFileUploadDialogOpen.set(open)}>
            <DialogTrigger>
                <Button>Upload</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload a file</DialogTitle>
                    <DialogDescription>
                        Upload a file to your account.
                    </DialogDescription>
                </DialogHeader>
                <input type="file" onChange={e => {
                    // file should not be accepted if there is already a file being uploaded
                    if ($fileUpload && $fileUpload?.state === "uploading") return

                    const file = e.target.files?.[0]
                    if (file) {
                        const previewUrl = URL.createObjectURL(file)
                        fileUpload.set({
                            file,
                            progress: 0,
                            state: 'idle',
                            previewUrl,
                        })
                        console.debug(previewUrl)
                    }
                }} />

                {$fileUpload && (
                    <img
                        src={$fileUpload.previewUrl}
                        alt="Preview"
                        className="square-aspect w-48 h-auto"
                    />
                )}

                {$fileUpload && (
                    <Progress value={$fileUpload.progress} className="w-[60%]" />
                )}
                <DialogFooter>
                    <Button onClick={handleFileUpload}>Upload</Button>
                    <button onClick={() => console.debug($fileUpload)}>test</button>
                </DialogFooter>
            </DialogContent>
            <Toaster />
        </Dialog>
    )
}