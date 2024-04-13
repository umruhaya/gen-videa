import { Button } from "@/components/ui/button";
import { useQuery, QueryClient, useMutation } from "@tanstack/react-query";
import UserSettingsDialog from "./UserSettingsDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { IconPencil } from "@tabler/icons-react";

const queryFn = async () => {
  const response = await fetch("");
  if (response.ok) {
    return response.json();
  }
  throw new Error("Failed to fetch user data");
};

type UserSettingsData = {
  username: string;
  profile_picture?: string;
  bio?: string;
};

const queryClient = new QueryClient();

const baselink = "https://storage.googleapis.com/static-web-pages/genv-avatars";

const avatars = Array.from({ length: 12 }).map((_, i) => `${baselink}/${i + 1}.jpg`);

export default function UserProfileHeader() {
  const { data, isLoading, refetch: refetchUserSettings } = useQuery<UserSettingsData>({
    queryKey: ["userSettings"],
    queryFn: () => axios.get("/api/profile/user-settings").then(res => res.data),
  }, queryClient);

  const mutation = useMutation({
    mutationKey: ["update-profile-picture"],
    mutationFn: ({ profile_picture }: { profile_picture: string }) => axios.post("/api/profile/user-settings", { profile_picture }),
  }, queryClient)

  const [selectedAvatar, setSelectedAvatar] = useState<null | string>(null);

  useEffect(() => {
    if (data?.profile_picture) {
      setSelectedAvatar(data.profile_picture);
    }
  }, [data?.profile_picture])

  // Indicates if the user is in edit mode for the profile picture and avatar selection.
  const [editMode, setEditMode] = useState(false);

  // move avatar in profile picture to first
  const sortedAvatars = selectedAvatar ? [selectedAvatar, ...avatars.filter((url) => url !== selectedAvatar)] : avatars;

  return (
    <div>
      <section className="p-2 md:p-8 flex gap-8">
        <div className="pr-8 border-r border-zinc border-solid">
          <div className="relative">
            <img
              className="w-32 h-32 rounded-full bg-zinc-800 aspect-square"
              src={data?.profile_picture}
            />
            <span 
              className="rounded-full icon-overlay absolute top-0 left-0 w-full h-full grid place-content-center bg-gray-500 opacity-0 hover:opacity-100 bg-opacity-50 cursor-pointer transition-opacity duration-300"
              onClick={() => setEditMode(true)}  
            >
              <IconPencil />
            </span>
          </div>
        </div>
        <div>
          <button className="text-sm font-semibold py-1 px-4 bg-zinc-800 rounded-3xl">@{data?.username}</button>
          {data?.bio && <p className="italic mt-2">{data?.bio}</p>}
          <hr className="my-2" />
          <div className="flex gap-4 items-center">
            <UserSettingsDialog invalidate={refetchUserSettings} />
            <a href="/browse">
              <Button variant="secondary" size="sm">
                Public
              </Button>
            </a>
          </div>
        </div>
      </section>
      <Dialog open={(data && !data?.profile_picture) || editMode} onOpenChange={() => {editMode && setEditMode(false)}}>
        <DialogContent className="max-w-4xl max-h-[80%] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle className="text-4xl">
              Profile Picture
            </DialogTitle>
            <DialogDescription className="mt-4">
              {!isLoading && (editMode ? "Make Sure to Save your new avatar" : "Opps! Looks like you haven't uploaded a profile picture yet. Lets select a cool avatar for you.")}
            </DialogDescription>
          </DialogHeader>
          <div className="w-full">
            <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedAvatars.map((url) => (
                <div className="flex justify-center" key={url}>
                  <img
                    src={url}
                    className={"w-48 h-48 rounded-full cursor-pointer" + (selectedAvatar === url ? " border-4 border-white" : "")}
                    onClick={() => setSelectedAvatar(url)}
                  />
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button disabled={!selectedAvatar || mutation.isPending} onClick={async () => {
              if (selectedAvatar && !mutation.isPending) {
                await mutation.mutateAsync({ profile_picture: selectedAvatar });
                refetchUserSettings();
              }
            }}>
              {mutation.isPending ? <Spinner /> : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
