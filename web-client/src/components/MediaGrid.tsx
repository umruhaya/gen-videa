import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { useQuery } from "@tanstack/react-query"
import FileUploadDialog from "@/components/FileUploadDialog";
import MediaViewDialog from '@/components/MediaDialog';
import DalleGenerateDialog from "@/components/DalleGenerateDialog";
import { $mediaDialog } from '@/store';
import { queryClient } from '@/store/query-client';

import {
    IconArrowWaveRightUp,
    IconBoxAlignRightFilled,
    IconBoxAlignTopLeft,
    IconClipboardCopy,
    IconFileBroken,
    IconSignature,
    IconTableColumn,
} from "@tabler/icons-react";
import axios from 'axios';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import VisionAITab from "./VisionAITab";

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

const icons = [
    <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
    <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    <IconSignature className="h-4 w-4 text-neutral-500" />,
    <IconTableColumn className="h-4 w-4 text-neutral-500" />,
    <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
    <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />,
    <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
]

function MediaComponent({ url, type }: { url: string, type: string }) {
    return type.includes("video") ? (
        <video controls src={url} className="w-full h-full object-cover rounded-xl" />
    ) : (
        <img src={url} className="w-full h-full object-cover rounded-xl" />
    );
}

function UserMediaGrid({ data, header }: { data?: UserMedia[], header: React.ReactNode }) {

    return (
        <section className="bg-zinc-200 dark:bg-zinc-900 min-h-screen rounded-3xl pb-24 w-full px-8">
            {header}
            {data && data.length === 0 && (
                <div className="flex justify-center w-full h-96">
                    <h2 className="text-xl font-semibold italic p-8">No media found.</h2>
                </div>
            )}
            <div>
                <BentoGrid className="max-w-4xl">
                    {data?.map((item, i) => (
                        <BentoGridItem
                            key={i}
                            title={item.name}
                            header={<MediaComponent url={item.url} type={item.content_type} />}
                            className="cursor-pointer bg-transparent bg-zinc-300 dark:bg-zinc-800"
                            onClick={() => $mediaDialog.set({
                                fileId: item.uuid,
                                isPublic: item.is_public,
                                title: item.name,
                                url: item.url,
                                isVideo: item.content_type.includes("video"),
                                isPersonalView: true
                            })}
                        />
                    ))}
                </BentoGrid>
            </div>
        </section>
    )
}

export default function MediaGrid() {
    const { data: systemGenerationsData, refetch: refetchGenerations } = useQuery<UserMedia[]>({
        queryKey: ["systemMedia"],
        queryFn: () => axios.get("/api/files/list-system-generations").then(res => res.data),
    }, queryClient);
    const { data: userUploadsData, refetch: refetchUploads } = useQuery<UserMedia[]>({
        queryKey: ["userMedia"],
        queryFn: () => axios.get("/api/files/list-user-uploads").then(res => res.data),
    }, queryClient);

    const tabs = [
        {
            title: "Generation",
            value: "systemGenerations",
            content: <UserMediaGrid
                data={systemGenerationsData}
                header={
                    <div className="w-full flex justify-between my-4">
                        <h2 className="my-4 text-2xl font-bold p-8">Generative Gallery</h2>
                        <div className="mx-4 my-auto">
                            <DalleGenerateDialog invalidate={refetchGenerations} />
                        </div>
                    </div>
                }
            />
        },
        {
            title: "My Uploads",
            value: "userUploads",
            content: <UserMediaGrid
                data={userUploadsData}
                header={
                    <div className="w-full flex justify-between my-4">
                        <h2 className="my-4 text-2xl font-bold p-8">My Uploads</h2>
                        <div className="mx-4 my-auto">
                            <FileUploadDialog invalidate={refetchUploads} />
                        </div>
                    </div >
                } />
        },
        {
            title: "Vision AI",
            value: "visionAI",
            content: <VisionAITab />
        }
    ]

    return (
        <div>
            <Tabs defaultValue="system-generations">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="system-generations">Dalle Generations</TabsTrigger>
                    <TabsTrigger value="user-uploads">User Uploads</TabsTrigger>
                    <TabsTrigger value="vision-ai">Vision AI</TabsTrigger>
                </TabsList>
                <TabsContent value="system-generations">
                    {tabs[0].content}
                </TabsContent>
                <TabsContent value="user-uploads">
                    {tabs[1].content}
                </TabsContent>
                <TabsContent value="vision-ai">
                    {tabs[2].content}
                </TabsContent>
            </Tabs>


            <MediaViewDialog inValidate={() => {
                refetchGenerations();
                refetchUploads();
            }} />
        </div>
    );
}