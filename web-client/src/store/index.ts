import { atom, map } from 'nanostores';

export const testStore = atom(false);

type FileUpload = {
    file: File;
    progress: number;
    previewUrl: string;
    state: "idle" | "uploading" | "done" | "error";
}

export const fileUpload = atom<FileUpload | null>(null)

type DalleGenerate = {
    state: "idle" | "generating" | "done" | "error";
    prompt: string;
}

export const dalleGenerate = atom<DalleGenerate>({
    state: "idle",
    prompt: ""
})

export const isFileUploadDialogOpen = atom(false)

export const isDalleGenerateDialogOpen = atom(false)

