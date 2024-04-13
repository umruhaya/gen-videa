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
import { $isFileUploadDialogOpen, $fileUpload } from '@/store';
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "./ui/toaster"
import { useRef } from 'react';
import { IconX } from '@tabler/icons-react';

// Type definition for props passed to the FileUploadDialog component.
// Includes a callback function to be called upon successful file upload.
type FileUploadDialogProps = {
    invalidate: () => void
}

const MAX_ALLOWED_VIDEO_DURATION = 120 // in seconds

// The FileUploadDialog component manages file uploads through a dialog interface.
// It provides feedback to the user via toast notifications and updates the global state accordingly.
export default function FileUploadDialog({ invalidate }: FileUploadDialogProps) {

    const inputRef = useRef<HTMLInputElement>(null)
    // Local state hooks for managing dialog visibility and file upload status.
    const isOpen = useStore($isFileUploadDialogOpen)
    const fileUpload = useStore($fileUpload)
    const { toast } = useToast()

    // Handles the file upload process, including making a request for an upload URL,
    // uploading the file, and providing user feedback via toast notifications.
    const handleFileUpload = async () => {
        // Prevents file upload if no file is selected or if a file is already uploading.
        if (!fileUpload) return
        if (fileUpload.state === "uploading") return

        // Sets the file upload state to 'uploading' and notifies the user.
        $fileUpload.set({ ...fileUpload, state: "uploading" })

        toast({
            title: "File upload started.",
            description: `Your file "${fileUpload.file.name}" has started uploading.`,
            action: (
                <ToastAction altText="Ack">Ok</ToastAction>
            )
        })
        // Fetches an upload URL from the backend and uploads the file to that URL.
        const response = await fetch("/api/files/create-file-upload-url", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                human_name: fileUpload.file.name,
                extension: "." + (fileUpload.file.name.split(".").pop() ?? "bin"),
            }),
        })
        const url = (await response.json())["url"] as string

        console.debug(url)

        // Configures and sends the XMLHttpRequest for the file upload.
        // Tracks upload progress and updates the state accordingly.
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                $fileUpload.set({ ...fileUpload, progress: percentComplete });
            }
        });

        xhr.onload = () => {
            // Updates the state based on the response status and provides user feedback.
            $fileUpload.set({ ...fileUpload, state: xhr.status === 200 ? "done" : "error" })
            if (xhr.status === 200) {
                toast({
                    title: "File uploaded.",
                    description: `Your file was uploaded successfully.`,
                    action: (
                        <ToastAction altText="Ack">Ok</ToastAction>
                    )
                })
                $fileUpload.set(null)
                $isFileUploadDialogOpen.set(false)
                // Invalidate after 3 seconds to allow the file to be processed and show up in the list
                setTimeout(() => invalidate(), 3000)
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
            // Error handling for network errors during file upload could be implemented here.
            // console.error(e.er)
        }

        xhr.open('PUT', url, true);
        xhr.setRequestHeader('Content-Type', fileUpload.file.type);
        xhr.send(fileUpload.file); // Starts the file upload.
    };

    // The component renders a dialog with file input, file upload progress, and upload control.
    // Provides feedback and previews for the selected file.
    // https://www.radix-ui.com/primitives/docs/components/dialog#api-reference
    return (
        <Dialog open={isOpen} onOpenChange={(open) => $isFileUploadDialogOpen.set(open)}>
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
                {
                    fileUpload ? (
                        <Button className="relative h-32 flex justify-start gap-8">
                            {fileUpload.file.type.startsWith("video") ? (
                                <video
                                    src={fileUpload.previewUrl}
                                    className="h-full"
                                    controls
                                />
                            ) : (
                                <img
                                    src={fileUpload.previewUrl}
                                    className="h-full"
                                />
                            )}
                            <div>{fileUpload.file.name}</div>
                            <div className="absolute top-2 right-2" onClick={() => $fileUpload.set(null)}>
                                <IconX />
                            </div>
                        </Button>
                    ) : (
                        <Button onClick={() => inputRef.current?.click()}>
                            Select a File
                        </Button>
                    )
                }
                <input ref={inputRef} className="hidden" type="file" accept="video/mp4,image/png,image/jpeg,video/x-matroska" onChange={async (e) => {
                    // file should not be accepted if there is already a file being uploaded
                    if (fileUpload && fileUpload?.state === "uploading") return

                    const file = e.target.files?.[0]

                    if (file) {
                        if (file.type !== "video/mp4" && file.type !== "image/png" && file.type !== "image/jpeg") {
                            return toast({
                                title: "File type not supported.",
                                description: `Only .mp4, .png, and .jpeg files are supported.`,
                                action: (
                                    <ToastAction altText="Ack">Ok</ToastAction>
                                )
                            });
                        }

                        // Check if the file is a video and perform a duration check.
                        if (file.type.startsWith("video")) {
                            const videoDuration = await getVideoDuration(file);
                            if (videoDuration > MAX_ALLOWED_VIDEO_DURATION) {
                                return toast({
                                    title: "Video too long",
                                    description: `Video Duration was ${videoDuration} seconds. Maximum allowed duration is ${MAX_ALLOWED_VIDEO_DURATION} seconds.`,
                                    action: (
                                        <ToastAction altText="Ack">Ok</ToastAction>
                                    )
                                });
                            }
                        }

                        const previewUrl = URL.createObjectURL(file)
                        $fileUpload.set({
                            file,
                            progress: 0,
                            state: 'idle',
                            previewUrl,
                        })
                        console.debug(previewUrl)
                    }
                }} />
                <p className="text-sm italic">Max Allowed Video Length is {MAX_ALLOWED_VIDEO_DURATION} seconds</p>
                <p className="text-sm italic">Only .mp4, .png, and .jpeg files are supported.</p>
                {fileUpload && (
                    <Progress value={fileUpload.progress} className="w-[60%]" />
                )}
                <DialogFooter>
                    <Button onClick={handleFileUpload}>Upload</Button>
                </DialogFooter>
            </DialogContent>
            <Toaster />
        </Dialog>
    )
}

// Helper function to check video duration
async function getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = function () {
            window.URL.revokeObjectURL(video.src);
            resolve(video.duration)
        };

        video.onerror = function () {
            reject("Error loading video metadata");
        };

        video.src = URL.createObjectURL(file);
    });
}