// Importing UI components and icons for use in the component
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

// Asynchronous function to fetch public uploads from the API
const publicUploadsQueryFn = async () => {
  const response = await fetch("/api/files/list-public-uploads");
  if (response.ok) {
    return response.json();
  }
  throw new Error("Failed to fetch public uploads");
};

// Type definition for the structure of a public media object
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

// Array of icons for use in displaying media items
const icons = [
  <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  <IconSignature className="h-4 w-4 text-neutral-500" />,
  <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
  <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />,
  <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
];

// Creating a new instance of QueryClient for fetching and caching queries
const queryClient = new QueryClient();
import React, { useState, useEffect } from 'react';

// The main component function
export default function PublicMediaGrid() {
  // Fetching public uploads data using the react-query hook
  const { data: publicUploadsData, error, refetch: refetchPublicUploads } = useQuery<PublicMedia[]>({ queryKey: ["publicUploads"], queryFn: publicUploadsQueryFn }, queryClient);

  // State for managing the search term and filtered uploads list
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUploads, setFilteredUploads] = useState<PublicMedia[]>([]);

  // Effect hook to filter uploads based on the search term
  useEffect(() => {
    if (publicUploadsData) {
      const filteredData = publicUploadsData.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUploads(filteredData);
    }
  }, [searchTerm, publicUploadsData]);

  // Display error message if there is an issue loading uploads
  if (error) {
    return <div>Error loading public uploads.</div>;
  }

  // Main render block, including a search input, back button, and the grid of uploads
  return (
    <div>
        {/* Search bar and Back to Profile button */}
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
        {/* Conditional rendering of search results or no results message */}
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
              />
            ))}
          </BentoGrid>
        )}
    </div>
  );
}