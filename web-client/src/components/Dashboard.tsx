import { useQuery, QueryClient } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"

const queryFn = async () => {
    const response = await fetch("/api/profile/user-settings")
    if(response.ok) {
        return response.json()
    }
    throw new Error("Failed to fetch user data")
}

type UserSettingsData = {
    username: string
}

const queryClient = new QueryClient()
export default function DashboardComponent() {

    const { data, isLoading } = useQuery<UserSettingsData>({ queryKey: ["userSettings"], queryFn }, queryClient)

    return (
        <section>

            <div className="my-8">
                {
                    isLoading ? (
                        <span><Skeleton className="w-40 h-8"/></span>
                    ) : <p>Welcome, {data?.username}</p>
                }
            </div>

            <div className="grid grid-cols-2 gap-8">
                <a href="/profile">
                    <div className="bg-blue-500 w-64 h-48 rounded-xl hover:scale-105">
                        <h1 className="text-white text-2xl font-bold p-4">View Profile</h1>
                    </div>
                </a>
                <a href="/settings">
                    <div className="bg-blue-500 w-64 h-48 rounded-xl hover:scale-105">
                        <h1 className="text-white text-2xl font-bold p-4">View User Settings</h1>
                    </div>
                </a>
                <div className="bg-blue-500 w-64 h-48 rounded-xl hover:scale-105">
                    <h1 className="text-white text-2xl font-bold p-4">Video Narration</h1>
                </div>
                <div className="bg-blue-500 w-64 h-48 rounded-xl hover:scale-105">
                    <h1 className="text-white text-2xl font-bold p-4">Content Generation</h1>
                </div>
                <div className="bg-blue-500 w-64 h-48 rounded-xl hover:scale-105">
                    <h1 className="text-white text-2xl font-bold p-4">AI enhancement</h1>
                </div>
            </div>
        </section>
    )
}
