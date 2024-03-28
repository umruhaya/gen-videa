import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconArrowWaveRightUp,
  IconBoxAlignRightFilled,
  IconBoxAlignTopLeft,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import { useQuery, QueryClient } from "@tanstack/react-query";

const publicUploadsQueryFn = async () => {
  const response = await fetch("/api/files/list-public-uploads");
  if (response.ok) {
    return response.json();
  }
  throw new Error("Failed to fetch public uploads");
};

type PublicMedia = {
  uuid: string;
  name: string;
  extension: string;
  content_type: string;
  url: string;
  is_uploaded: boolean;
  is_public: boolean;
  username: string;
  email: string;
};

const icons = [
  <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
    <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    <IconSignature className="h-4 w-4 text-neutral-500" />,
    <IconTableColumn className="h-4 w-4 text-neutral-500" />,
    <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
    <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />,
    <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
];

const queryClient = new QueryClient();

export default function PublicMediaGrid() {
  const { data: publicUploadsData, refetch: refetchPublicUploads } = useQuery<PublicMedia[]>({ queryKey: ["publicUploads"], queryFn: publicUploadsQueryFn }, queryClient);

  return (
    <div>
      <section>
        <h2 className="text-2xl font-bold my-4">Public Uploads</h2>
        <BentoGrid className="max-w-4xl mx-auto">
          {publicUploadsData?.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.name}
              header={<img src={item.url} alt={item.name} className="w-full h-full object-cover rounded-xl" />}
              icon={icons[Math.floor(Math.random() * icons.length)]}
              description={"Uploaded by " + item.username}
            />
          ))}
        </BentoGrid>
      </section>
    </div>
  );
}
