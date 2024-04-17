import { useStore } from '@nanostores/react';
import { Button } from "@/components/ui/button";
import Spinner from '@/components/Spinner';
import AlertDialogButton from '@/components/AlertDialogButton';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogPortal,
    DialogTrigger,
} from "@/components/ui/dialog"
import { $mediaDialog } from '@/store';
import { useMutation } from '@tanstack/react-query';
import { IconTrash } from '@tabler/icons-react';
import axios from "axios";
import { queryClient } from '@/store/query-client';
import VisionAIDialog from '@/components/VisionAIDialog';

type VisibilityMutationParams = {
    fileId: string;
    isPublic: boolean;
}

type DeleteMutationParams = {
    fileId: string;
}

type MediaDialogView = {
    inValidate?: () => void;
}

export default function MediaViewDialog({ inValidate }:MediaDialogView) {

    const mediaDialog = useStore($mediaDialog)

    const visibilityMutation = useMutation({
        mutationKey: ["update-file-visibility"],
        mutationFn: ({ fileId, isPublic }: VisibilityMutationParams) => axios.patch('/api/files/update-file-visibility', {
            file_id: fileId,
            is_public: isPublic,
        }),
        onSuccess: () => {
            inValidate && inValidate()
            mediaDialog && $mediaDialog.set({ ...mediaDialog, isPublic: !mediaDialog.isPublic })
        }
    }, queryClient);

    const deleteMutation = useMutation({
        mutationKey: ["delete-file"],
        mutationFn: ({ fileId }: DeleteMutationParams) => axios.delete(`/api/files/delete-file?file_id=${fileId}`),
        onSuccess: () => {
            inValidate && inValidate()
            mediaDialog && $mediaDialog.set(null)
        }
    }, queryClient);

    // Local state hooks for managing dialog visibility and file upload status.

    const currentVisibility = mediaDialog?.isPublic ? "Public" : "Private"
    const newVisbility = mediaDialog?.isPublic ? "Private" : "Public"

    console.log("isPending", visibilityMutation.isPending)

    return (
        <Dialog open={Boolean(mediaDialog)} onOpenChange={(open) => open || $mediaDialog.set(null)}>
            <DialogContent className="max-w-4xl max-h-[80%] overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle className="text-4xl">
                        {mediaDialog?.title.toUpperCase()}
                    </DialogTitle>
                    <DialogDescription className="mt-4">
                        {mediaDialog?.uploader && <div className="mb-4 cursor-pointer">
                            Uploaded by {mediaDialog.uploader}
                        </div>}
                        {mediaDialog?.isVideo ? (
                            <video controls src={mediaDialog.url} className="w-full" />
                        ) : (
                            <div className="flex justify-center">
                                <img src={mediaDialog?.url} className="w-1/2" />
                            </div>
                        )}
                        <div className="mt-8 text-lg">
                            {mediaDialog?.title && <div>Title: <em>{mediaDialog.title}</em></div>}
                            {mediaDialog?.catpion && <div>Caption: <em>{mediaDialog.catpion}</em></div>}
                            <div>Visbility: {currentVisibility}</div>
                        </div>
                        {mediaDialog?.isPersonalView && (
                            <div className="flex flex-col gap-4 mt-8">
                                <h2 className="text-2xl">
                                    Actions
                                </h2>
                                <hr />
                                <div className="flex gap-4 p-4">
                                    <AlertDialogButton
                                        title="Delete File"
                                        description="This action cannot be undone. This will permanently delete file from our servers."
                                        onConfirm={() => { deleteMutation.mutate({ fileId: mediaDialog.fileId }) }}
                                    >
                                        <Button variant="outline">
                                            {deleteMutation.isPending ? <Spinner /> : <IconTrash />}
                                        </Button>
                                    </AlertDialogButton>
                                    <AlertDialogButton
                                        title="Change Visbility"
                                        description={`Please confirm that you want to change the visibility to ${newVisbility} of this file.`}
                                        onConfirm={() => visibilityMutation.mutate({ fileId: mediaDialog.fileId, isPublic: !mediaDialog.isPublic })}
                                    >
                                        <Button disabled={visibilityMutation.isPending}>
                                            {visibilityMutation.isPending ? <Spinner /> : `Change Visibility to ${newVisbility}`}
                                        </Button>
                                    </AlertDialogButton>
                                </div>
                                <VisionAIDialog file_id={mediaDialog?.fileId} is_video={mediaDialog.isVideo} invalidate={() => {}} />
                            </div>
                        )}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
