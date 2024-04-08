// ==========================================================================

import React, { useState } from 'react';
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { useQuery, QueryClient } from "@tanstack/react-query"
import FileUploadDialog from "@/components/FileUploadDialog";
import DalleGenerateDialog from "./DalleGenerateDialog";
import PrivacyDialog from "./PrivacyDialog"; // Import PrivacyDialog component


import {
    IconArrowWaveRightUp,
    IconBoxAlignRightFilled,
    IconBoxAlignTopLeft,
    IconClipboardCopy,
    IconFileBroken,
    IconSignature,
    IconTableColumn,
} from "@tabler/icons-react";


const userUploadsQueryFn = async () => {
    const response = await fetch("/api/files/list-user-uploads")
    if (response.ok) {
        return response.json()
    }
    throw new Error("Failed to fetch user data.")
}

const systemGensQueryFn = async () => {
    const response = await fetch("/api/files/list-system-generations")
    if (response.ok) {
        return response.json()
    }
    throw new Error("Failed to fetch user data")
}

type UserMedia = {
    uuid: string
    name: string
    extension: string
    content_type: string
    url: string
    is_uploaded: boolean
    is_processed: boolean
    is_public: boolean;
}
type PrivacyDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    file?: UserMedia; // Make 'file' prop optional
    onVisibilityChange: (fileId: string, isPublic: boolean) => void;
};

const icons = [
    <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
    <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    <IconSignature className="h-4 w-4 text-neutral-500" />,
    <IconTableColumn className="h-4 w-4 text-neutral-500" />,
    <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
    <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />,
    <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
]

const queryClient = new QueryClient()

export default function MediaGrid() {
    const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<UserMedia | null>(null);

    const GreenCircleIcon = ({ className, onClick }: { className: string; onClick: () => void }) => (
        <svg onClick={onClick} className={`h-6 w-6 text-green-500 cursor-pointer ${className}`} fill="currentColor" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="10" />
        </svg>
      );
      
      const RedCircleIcon = ({ className, onClick }: { className: string; onClick: () => void }) => (
        <svg onClick={onClick} className={`h-6 w-6 text-red-500 cursor-pointer ${className}`} fill="currentColor" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="10" />
        </svg>
      );
      

    const DeleteIcon = ({ className, onClick }: { className: string, onClick: any }) => (
        <svg onClick={onClick} className={`h-6 w-6 text-red-500 cursor-pointer ${className}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.707 10l-3-3-1.414 1.414L7.293 11.5l-3 3 1.414 1.414 3-3 3 3 1.414-1.414-3-3 3-3-1.414-1.414-3 3z" clipRule="evenodd" />
        </svg>
    );



    const { data: systemGenerationsData, refetch: refetchGenerations } = useQuery<UserMedia[]>({ queryKey: ["systemMedia"], queryFn: systemGensQueryFn }, queryClient);
    const { data: userUploadsData, refetch: refetchUploads } = useQuery<UserMedia[]>({ queryKey: ["userMedia"], queryFn: userUploadsQueryFn }, queryClient);

    const systemGenerations = systemGenerationsData ? systemGenerationsData.map(item => ({
        title: item.name,
        header:
            (<div className='relative'>
                <img src={item.url} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                <DeleteIcon className="absolute top-0 left-0 m-1" onClick={() => handleDelete(item.uuid)} />
            </div>),
        icon: icons[Math.floor(Math.random() * icons.length)]
    })) : items;

    type IntrinsicAttributes = {
        onClick?: () => void;
    };

    const userUploads = userUploadsData ? userUploadsData.map((item, i) => ({
        title: item.name,
        header: (
            <div className="relative">
                <img src={item.url} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                <DeleteIcon className="absolute top-0 left-0 m-1" onClick={(e:any) => { e.stopPropagation(); handleDelete(item.uuid); }} />
                {item.is_public ? (
                    <GreenCircleIcon className="absolute top-0 right-0 m-1" onClick={() => handlePrivacyDialogOpen(item)} />
                ) : (
                    <RedCircleIcon className="absolute top-0 right-0 m-1" onClick={() => handlePrivacyDialogOpen(item)} />
                )}
            </div>
        ),
        icon: icons[Math.floor(Math.random() * icons.length)]
    })) : [];



    const handlePrivacyDialogOpen = (file: UserMedia) => {
        setSelectedFile(file);
        setPrivacyDialogOpen(true);
    };

    const handlePrivacyDialogClose = () => {
        setPrivacyDialogOpen(false);
    };

    const handleVisibilityChange = async (fileId: string, isPublic: boolean) => {
        try {
            const response = await fetch('/api/files/update-file-visibility', {
                method: 'PATCH', // Change this from 'POST' to 'PATCH'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    file_id: fileId,
                    is_public: isPublic
                })
            });

            if (!response.ok) {
                const errorResponse = await response.text(); // or response.json() if the server sends JSON
                console.error('Failed to update file visibility:', errorResponse);
                throw new Error(`Failed to update file visibility: ${errorResponse}`);
            }
            console.log(`Visibility updated for file ${fileId}, response status: ${response.status}`);
            await refetchUploads();
        } catch (error) {
            console.error('Error updating file visibility:', error);
        }
    };

    const handleDelete = async (fileId: any) => {
        if (confirm('Are you sure you want to delete this item?')) {
            try {
                const queryParams = new URLSearchParams({ file_id: fileId });
                const response = await fetch(`/api/files/delete-file?${queryParams}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 200) {
                    console.log(`File deleted, response status: ${response.status}`);

                    await refetchUploads();
                    await refetchGenerations();
                }
                else {
                    const errorResponse = await response.text();
                    console.error('Failed to delete file:', errorResponse);
                    throw new Error(`Failed to delete file: ${errorResponse}`);
                }
            } catch (error) {
                console.error('Error deleting file:', error);
            }
        }
    };





    return (
        <div>
            <section>
                <div className="w-full flex justify-between my-4">
                    <h2 className="my-4 text-2xl font-bold">Generative Gallery</h2>
                    <div className="mx-4 my-auto">
                        <DalleGenerateDialog invalidate={refetchGenerations} />
                    </div>
                </div>
                <BentoGrid className="max-w-4xl mx-auto">
                    {systemGenerations.map((item, i) => (
                        <BentoGridItem
                            key={i}
                            {...item}
                        />
                    ))}
                </BentoGrid>
            </section>
            <section>
                <div className="w-full flex justify-between my-4">
                    <h2 className="my-4 text-2xl font-bold">My Uploads</h2>
                    <div className="mx-4 my-auto">
                        <FileUploadDialog invalidate={refetchUploads} />
                    </div>
                </div>
                <BentoGrid className="max-w-4xl mx-auto">
                    {userUploads.map((item, i) => (
                        <BentoGridItem
                            key={i}
                            title={item.title}
                            header={item.header}
                            icon={item.icon}
                        />
                    ))}
                </BentoGrid>

            </section>
            {privacyDialogOpen && selectedFile && (
                <PrivacyDialog
                    isOpen={privacyDialogOpen}
                    onClose={handlePrivacyDialogClose}
                    file={selectedFile}
                    onVisibilityChange={handleVisibilityChange}
                />
            )}
        </div>
    );
}

const Skeleton = () => (
    <div className="flex flex-1 w-full square-aspect min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);

const items = [
    {
        title: "The Dawn of Innovation",
        header: <Skeleton />,
        icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "The Digital Revolution",
        header: <Skeleton />,
        icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "The Art of Design",
        header: <Skeleton />,
        icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "The Power of Communication",
        header: <Skeleton />,
        icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "The Pursuit of Knowledge",
        header: <Skeleton />,
        icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "The Joy of Creation",
        header: <Skeleton />,
        icon: <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "The Spirit of Adventure",
        header: <Skeleton />,
        icon: <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
    },
];