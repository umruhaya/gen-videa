import { useState, useEffect } from 'react';
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MediaViewDialog from '@/components/MediaDialog';
import { $mediaDialog } from "@/store";
import { IconSearch } from "@tabler/icons-react";
import { useQuery, QueryClient } from "@tanstack/react-query";
import {
  IconArrowWaveRightUp,
  IconBoxAlignRightFilled,
  IconBoxAlignTopLeft,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";

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
  const { data: publicUploadsData, error } = useQuery<PublicMedia[]>({ queryKey: ["publicUploads"], queryFn: publicUploadsQueryFn }, queryClient);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUploads, setFilteredUploads] = useState<PublicMedia[]>([]);

  useEffect(() => {
    if (publicUploadsData) {
      const filteredData = publicUploadsData.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUploads(filteredData);
    }
  }, [searchTerm, publicUploadsData]);

  if (error) {
    return <div>Error loading public uploads.</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-semibold mb-8">
        Public Dalle Generations
      </h1>
      <section className="flex justify-between items-center mb-8">
        <div className="flex border border-gray-200 rounded">
          <IconSearch className="m-2 text-neutral-500" />
          <Input
            type="text"
            placeholder="Search captions..."
            className="input input-bordered input-sm w-full max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <a href="/profile">
          <Button variant="secondary" size="sm">
            Back to Profile
          </Button>
        </a>
      </section>
      {(filteredUploads.length === 0 && searchTerm) ? (
        <div className="text-center py-10">
          <p>No public uploads found.</p>
        </div>
      ) : (
        <BentoGrid className="max-w-4xl mx-auto">
          {filteredUploads.map((item: PublicMedia, i: number) => (
            <BentoGridItem
              key={item.uuid}
              title={item.name}
              header={<img src={item.url} alt={item.name} className="w-full h-full object-cover rounded-xl" />}
              icon={icons[i % icons.length]}
              description={"Uploaded by " + item.username}
              onClick={() => $mediaDialog.set({ 
                title: item.name,
                url: item.url,
                isVideo: false,
                uploader: item.username,
                fileId: item.uuid,
                isPublic: item.is_public,
              })}
            />
          ))}
        </BentoGrid>
      )}
      <MediaViewDialog />
    </div>
  );
}