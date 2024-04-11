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

export default function MediaGrid() {
    const { data: systemGenerationsData, refetch: refetchGenerations } = useQuery<UserMedia[]>({
        queryKey: ["systemMedia"],
        queryFn: () => axios.get("/api/files/list-system-generations").then(res => res.data),
    }, queryClient);
    const { data: userUploadsData, refetch: refetchUploads } = useQuery<UserMedia[]>({
        queryKey: ["userMedia"],
        queryFn: () => axios.get("/api/files/list-user-uploads").then(res => res.data),
    }, queryClient);

    const systemGenerations = systemGenerationsData?.map((item, i) => ({
        ...item,
        header: <MediaComponent url={item.url} type={item.content_type} />,
    }));

    const userUploads = userUploadsData?.map((item, i) => ({
        ...item,
        header: <MediaComponent url={item.url} type={item.content_type} />,
    }));

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
                    {systemGenerations?.map((item, i) => (
                        <BentoGridItem
                            key={i}
                            title={item.name}
                            header={item.header}
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
            </section>
            <section>
                <div className="w-full flex justify-between my-4">
                    <h2 className="my-4 text-2xl font-bold">My Uploads</h2>
                    <div className="mx-4 my-auto">
                        <FileUploadDialog invalidate={refetchUploads} />
                    </div>
                </div>
                <BentoGrid className="max-w-4xl mx-auto">
                    {userUploads?.map((item, i) => (
                        <BentoGridItem
                            key={i}
                            title={item.name}
                            header={item.header}
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
            </section>
            <MediaViewDialog inValidate={() => {
                refetchGenerations();
                refetchUploads();
            }}/>
        </div>
    );
}