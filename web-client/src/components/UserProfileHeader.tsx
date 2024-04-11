// Importing necessary components and hooks
import { Button } from "@/components/ui/button";
import { useQuery, QueryClient } from "@tanstack/react-query";
import UserSettingsDialog from "./UserSettingsDialog";

// Asynchronous function to fetch user settings data from the server
const queryFn = async () => {
  const response = await fetch("/api/profile/user-settings");
  if (response.ok) {
    return response.json(); // If the request is successful, return the JSON response
  }
  throw new Error("Failed to fetch user data"); // If the request fails, throw an error
};

// Type definition for the structure of user settings data
type UserSettingsData = {
  username: string; // Expects a username of type string
};

// Instantiating a new QueryClient for react-query
const queryClient = new QueryClient();

// The UserProfileHeader functional component
export default function UserProfileHeader() {
  // Using the useQuery hook to fetch user settings data
  const { data, isLoading, refetch: refetchUserSettings } = useQuery<UserSettingsData>({
    queryKey: ["userSettings"],
    queryFn
  }, queryClient);

  // Render the user profile header UI
  return (
    <section className="p-8">
      <h1 className="text-4xl font-bold mb-2">Profile</h1>
      <p className="text-2xl font-semibold">Username: {data?.username}</p>
      <p className="italic">Hey there! I'm using GenVidea.</p>
      <hr className="my-2" />
      <div className="flex gap-4 items-center">
        <UserSettingsDialog invalidate={refetchUserSettings}/>
        <a href="/browse">
        <Button variant="secondary" size="sm">
          Public
        </Button>
        </a>
      </div>
    </section>
  );
}
