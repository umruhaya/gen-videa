// import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
//hehehehe
// import {
//     IconArrowWaveRightUp,
//     IconBoxAlignRightFilled,
//     IconBoxAlignTopLeft,
//     IconClipboardCopy,
//     IconFileBroken,
//     IconSignature,
//     IconTableColumn,
// } from "@tabler/icons-react";
// import { useQuery, QueryClient } from "@tanstack/react-query"
// import FileUploadDialog from "@/components/FileUploadDialog";
// import DalleGenerateDialog from "./DalleGenerateDialog";

// const userUploadsQueryFn = async () => {
//     const response = await fetch("/api/files/list-user-uploads")
//     if (response.ok) {
//         return response.json()
//     }
//     throw new Error("Failed to fetch user data")
// }

// const systemGensQueryFn = async () => {
//     const response = await fetch("/api/files/list-system-generations")
//     if (response.ok) {
//         return response.json()
//     }
//     throw new Error("Failed to fetch user data")
// }

// type UserMedia = {
//     uuid: string
//     name: string
//     extension: string
//     content_type: string
//     url: string
//     is_uploaded: boolean
//     is_processed: boolean
// }

// const icons = [
//     <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
//     <IconFileBroken className="h-4 w-4 text-neutral-500" />,
//     <IconSignature className="h-4 w-4 text-neutral-500" />,
//     <IconTableColumn className="h-4 w-4 text-neutral-500" />,
//     <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
//     <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />,
//     <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
// ]

// const queryClient = new QueryClient()

// export default function MediaGrid() {

//     const { data: systemGenerationsData, refetch: refetchGenerations } = useQuery<UserMedia[]>({ queryKey: ["systemMedia"], queryFn: systemGensQueryFn }, queryClient)
//     const { data: userUploadsData, refetch: refetchUploads } = useQuery<UserMedia[]>({ queryKey: ["userMedia"], queryFn: userUploadsQueryFn }, queryClient)

//     const systemGenerations = systemGenerationsData ? systemGenerationsData.map(item => ({
//         title: item.name,
//         header: <img src={item.url} alt={item.name} className="w-full h-full object-cover rounded-xl" />,
//         icon: icons[Math.floor(Math.random() * icons.length)]
//     })) : items

//     const userUploads = userUploadsData ? userUploadsData.map(item => ({
//         title: item.name,
//         header: <img src={item.url} alt={item.name} className="w-full h-full object-cover rounded-xl" />,
//         icon: icons[Math.floor(Math.random() * icons.length)]
//     })) : items

//     return (
//         <div>
//             <section>
//                 <div className="w-full flex justify-between my-4">
//                     <h2 className="my-4 text-2xl font-bold">Generative Gallery</h2>
//                     <div className="mx-4 my-auto">
//                         <DalleGenerateDialog invalidate={refetchGenerations}/>
//                     </div>
//                 </div>
//                 <BentoGrid className="max-w-4xl mx-auto">
//                     {systemGenerations.map((item, i) => (
//                         <BentoGridItem
//                             key={i}
//                             {...item}
//                         />
//                     ))}
//                 </BentoGrid>
//             </section>
//             <section>
//                 <div className="w-full flex justify-between my-4">
//                     <h2 className="my-4 text-2xl font-bold">My Uploads</h2>
//                     <div className="mx-4 my-auto">
//                         <FileUploadDialog invalidate={refetchUploads}/>
//                     </div>
//                 </div>
//                 <BentoGrid className="max-w-4xl mx-auto">
//                     {userUploads.map((item, i) => (
//                         <BentoGridItem
//                             key={i}
//                             {...item}
//                         />
//                     ))}
//                 </BentoGrid>
//             </section>
//         </div>
//     );
// }
// const Skeleton = () => (
//     <div className="flex flex-1 w-full square-aspect min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
// );

// const items = [
//     {
//         title: "The Dawn of Innovation",
//         header: <Skeleton />,
//         icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
//     },
//     {
//         title: "The Digital Revolution",
//         header: <Skeleton />,
//         icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
//     },
//     {
//         title: "The Art of Design",
//         header: <Skeleton />,
//         icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
//     },
//     {
//         title: "The Power of Communication",
//         header: <Skeleton />,
//         icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
//     },
//     {
//         title: "The Pursuit of Knowledge",
//         header: <Skeleton />,
//         icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
//     },
//     {
//         title: "The Joy of Creation",
//         header: <Skeleton />,
//         icon: <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />,
//     },
//     {
//         title: "The Spirit of Adventure",
//         header: <Skeleton />,
//         icon: <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
//     },
// ];

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
}

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
    const [selectedFile, setSelectedFile] = useState(null);

    const { data: systemGenerationsData, refetch: refetchGenerations } = useQuery<UserMedia[]>({ queryKey: ["systemMedia"], queryFn: systemGensQueryFn }, queryClient);
    const { data: userUploadsData, refetch: refetchUploads } = useQuery<UserMedia[]>({ queryKey: ["userMedia"], queryFn: userUploadsQueryFn }, queryClient);

    const systemGenerations = systemGenerationsData ? systemGenerationsData.map(item => ({
        title: item.name,
        header: <img src={item.url} alt={item.name} className="w-full h-full object-cover rounded-xl" />,
        icon: icons[Math.floor(Math.random() * icons.length)]
    })) : items;

    const userUploads = userUploadsData ? userUploadsData.map(item => ({
        title: item.name,
        header: <img src={item.url} alt={item.name} className="w-full h-full object-cover rounded-xl" />,
        icon: icons[Math.floor(Math.random() * icons.length)]
    })) : items;

    const handlePrivacyDialogOpen = (file) => {
        setSelectedFile(file);
        setPrivacyDialogOpen(true);
    };

    const handlePrivacyDialogClose = () => {
        setPrivacyDialogOpen(false);
    };

    const handleVisibilityChange = (fileId, isPublic) => {
        console.log("File ID:", fileId);
        console.log("Is Public:", isPublic);
        setPrivacyDialogOpen(false);
        // Implement logic to change file visibility
    };

    return (
        <div>
            <section>
                <div className="w-full flex justify-between my-4">
                    <h2 className="my-4 text-2xl font-bold">Generative Gallery</h2>
                    <div className="mx-4 my-auto">
                        <DalleGenerateDialog invalidate={refetchGenerations}/>
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
                        <FileUploadDialog invalidate={refetchUploads}/>
                    </div>
                </div>
                <BentoGrid className="max-w-4xl mx-auto">
                    {userUploads.map((item, i) => (
                        <div key={i} onClick={() => handlePrivacyDialogOpen(item)}>
                            <BentoGridItem
                                {...item}
                            />
                        </div>
                    ))}
                </BentoGrid>
            </section>
            <PrivacyDialog
                isOpen={privacyDialogOpen}
                onClose={handlePrivacyDialogClose}
                file={selectedFile}
                onVisibilityChange={handleVisibilityChange}
            />
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