import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Button } from "@/components/ui/button";
import '../styles/searchbar.css';
import { IconSearch } from "@tabler/icons-react";

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
import React, { useState, useEffect } from 'react';

export default function PublicMediaGrid() {
  const { data: publicUploadsData, error, refetch: refetchPublicUploads } = useQuery<PublicMedia[]>({ queryKey: ["publicUploads"], queryFn: publicUploadsQueryFn }, queryClient);

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

  if (filteredUploads.length === 0 && searchTerm) {
    return (
      <div>
        <section className="flex justify-between items-center">
          <div className="flex border border-gray-200 rounded">
            <IconSearch className="m-2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search captions..."
              className="custom-search-input input input-bordered input-sm w-full max-w-xs"
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
        <div className="text-center py-10">
          <p>No results found for "{searchTerm}".</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section>
        <section className="flex justify-between items-center">
          <div className="flex border border-gray-200 rounded">
            <IconSearch className="m-2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search captions..."
              className="custom-search-input input input-bordered input-sm w-full max-w-xs"
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
        <BentoGrid className="max-w-4xl mx-auto">
          {filteredUploads.map((item: PublicMedia, i: number) => (
            <BentoGridItem
              key={item.uuid}
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