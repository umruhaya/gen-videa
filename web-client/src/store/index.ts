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

//store for the open state of the user settings dialog
export const isUserSettingsDialogOpen = atom(false);

type UserSettings = {
    state: "idle" | "saving" | "done" | "error";
    username: string;
};

// Initial state of the user settings. Retrieve the current settings from your backend if needed
export const userSettings = atom<UserSettings>({
    state: "idle",
    username: "", // Initialize with the current username if available
});

