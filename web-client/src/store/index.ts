import { atom, map } from 'nanostores';

export const testStore = atom(false);

type FileUpload = {
    file: File;
    progress: number;
    previewUrl: string;
    state: "idle" | "uploading" | "done" | "error";
}

export const fileUpload = atom<FileUpload | null>(null)

export const isFileUploadDialogOpen = atom(false)