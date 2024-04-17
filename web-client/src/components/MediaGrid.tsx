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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import VisionAITab from "./VisionAITab";
import { Button } from "./ui/button";
import { useState } from "react";
import { Label } from "./ui/label";

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

// Render a dynamic grid layout using BentoGrid to display media items, enabling user interaction through clicking on individual items.
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


// Set up tabbed navigation with dynamic content rendering based on tab selection, enhancing user interface navigation.
export default function MediaGrid() {
    // Use React Query to fetch user media and system generated media from the server asynchronously.
    const { data: systemGenerationsData, refetch: refetchGenerations } = useQuery<UserMedia[]>({
        queryKey: ["systemMedia"],
        queryFn: () => axios.get("/api/files/list-system-generations").then(res => res.data),
    }, queryClient);
    const { data: userUploadsData, refetch: refetchUploads } = useQuery<UserMedia[]>({
        queryKey: ["userMedia"],
        queryFn: () => axios.get("/api/files/list-user-uploads").then(res => res.data),
    }, queryClient);

    // Define state hooks for filtering media by content type and visibility, providing interactive filter capabilities to the user.
    const [contentTypeFilter, setContentTypeFilter] = useState<"all" | "video" | "image">("all");
    const [visibilityFilter, setVisibilityFilter] = useState<"all" | "public" | "private">("all");

    const filteredUploads = userUploadsData
        ?.filter(item => contentTypeFilter === "all" || item.content_type.includes(contentTypeFilter))
        ?.filter(item => visibilityFilter === "all" || item.is_public === (visibilityFilter === "public"));

    const tabs = [
        {
            title: "Generation",
            value: "systemGenerations",
            content: <UserMediaGrid
                data={systemGenerationsData}
                header={
                    <div className="w-full flex justify-between mt-4 p-8">
                        <h2 className="my-4 text-2xl font-bold">Generative Gallery</h2>
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
                data={filteredUploads}
                header={
                    <div className="flex flex-col gap-4 p-8 mt-4">
                        <div className="w-full flex justify-between">
                            <h2 className="my-4 text-2xl font-bold">My Uploads</h2>
                            <div className="mx-4 my-auto flex gap-2 items-center">
                                <FileUploadDialog invalidate={refetchUploads} />
                            </div>
                        </div >
                        <div className="flex gap-4">
                            <div>
                                <Label>Visibility</Label>
                                <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by Visibility" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Visibility</SelectLabel>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="public">Public</SelectItem>
                                            <SelectItem value="private">Private</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Media Type</Label>
                                <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by Content Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Media Type</SelectLabel>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="image">Images</SelectItem>
                                            <SelectItem value="video">Videos</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
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
                <div className="flex flex-col-reverse mt-4 gap-2 md:gap-12 content-center md:flex-row">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="system-generations">Dalle Generations</TabsTrigger>
                        <TabsTrigger value="user-uploads">User Uploads</TabsTrigger>
                        <TabsTrigger value="vision-ai">Vision AI</TabsTrigger>
                    </TabsList>
                    <a href="/browse">
                        <Button variant="secondary" size="sm">
                            Public Dalle Generations
                        </Button>
                    </a>
                </div>
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