import { atom, map } from 'nanostores';

type FileUpload = {
    file: File;
    progress: number;
    previewUrl: string;
    state: "idle" | "uploading" | "done" | "error";
}

export const $fileUpload = atom<FileUpload | null>(null)

type DalleGenerate = {
    state: "idle" | "generating" | "done" | "error";
    prompt: string;
}

export const $dalleGenerate = atom<DalleGenerate>({
    state: "idle",
    prompt: ""
})

export const $isFileUploadDialogOpen = atom(false)

export const $isDalleGenerateDialogOpen = atom(false)

//store for the open state of the user settings dialog
export const $isUserSettingsDialogOpen = atom(false);

export const $isVisionAIDialogOpen = atom(false);

type MediaDialogView = {
    fileId: string;
    isPublic: boolean;
    title: string;
    // suggest if the media is video or image
    isVideo: boolean;
    url: string;
    catpion?: string;
    // uploader of the media
    uploader?: string;
    // suggests that the view is personal to the user, there allow for edit/delete operations
    isPersonalView?: boolean;
}

export const $mediaDialog = atom<MediaDialogView | null>(null)
