// React Query is used for data fetching and state management.
import { useQuery, QueryClient } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"

// Defines an asynchronous function to fetch user settings from the API.
// Throws an error if the fetch operation fails.
const queryFn = async () => {
    const response = await fetch("/api/profile/user-settings")
    if(response.ok) {
        return response.json()
    }
    throw new Error("Failed to fetch user data")
}

// Type definition for the structure of user settings data.
type UserSettingsData = {
    username: string
}

// Initializes a QueryClient instance for React Query.
// This client manages the cache and background updates for queries.
const queryClient = new QueryClient()

// Functional component for the Dashboard.
// Utilizes React Query to fetch and display user settings, along with navigation and upcoming features.
export default function DashboardComponent() {

    // Fetches user settings using React Query.
    // Displays a loading skeleton while the data is being fetched.
    const { data, isLoading } = useQuery<UserSettingsData>({ queryKey: ["userSettings"], queryFn }, queryClient)

    return (
        <section>
             {/* Displays a greeting to the user with their username if data has loaded, otherwise shows a loading skeleton. */}
            <div className="my-8">
                {
                    isLoading ? (
                        <span><Skeleton className="w-40 h-8"/></span>
                    ) : <p>Welcome, {data?.username}</p>
                }
            </div>

            {/* Grid layout for dashboard features. Currently includes a link to view the profile and placeholders for upcoming features. */}
            <div className="grid grid-cols-2 gap-8">
                <a href="/profile">
                    <div className="bg-blue-500 p-4 w-64 h-48 rounded-xl hover:scale-105">
                        <h1 className="text-white text-2xl font-bold">View Profile</h1>
                    </div>
                </a>
                
                {/* Placeholder sections for upcoming dashboard features. */}
                <div className="bg-blue-500 p-4 w-64 h-48 rounded-xl hover:scale-105">
                    <h1 className="text-white text-2xl font-bold">Video Narration</h1>
                    <em>comming soon!</em>
                </div>
                <div className="bg-blue-500 p-4 w-64 h-48 rounded-xl hover:scale-105">
                    <h1 className="text-white text-2xl font-bold">AI enhancement</h1>
                    <em>comming soon!</em>
                </div>
            </div>
        </section>
    )
}
