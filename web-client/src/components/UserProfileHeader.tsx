import { Button } from "@/components/ui/button";
import { useQuery, QueryClient } from "@tanstack/react-query"
import { SettingsIcon } from "lucide-react";

const queryFn = async () => {
  const response = await fetch("/api/profile/user-settings")
  if (response.ok) {
    return response.json()
  }
  throw new Error("Failed to fetch user data")
}

type UserSettingsData = {
  username: string
}

const queryClient = new QueryClient()

export default function UserProfileHeader() {

  const { data, isLoading } = useQuery<UserSettingsData>({ queryKey: ["userSettings"], queryFn }, queryClient)

  return (
    <section className="p-8">
      <h1 className="text-4xl font-bold mb-2">Profile</h1>
      <p className="text-2xl font-semibold">Username: {data?.username}</p>
      <p className="italic">Hey there! Im using GenVidea</p>
      <hr className="my-2" />
      <div className="flex gap-4">
        <a href="/settings">
          <Button>
            <SettingsIcon size={24} />
          </Button>
        </a>
      </div>
    </section>
  )
}