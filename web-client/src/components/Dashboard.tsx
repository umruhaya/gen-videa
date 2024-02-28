import { Button } from "./ui/button"

export default function DashboardComponent() {

    const handleLogout = async () => {
        const response = await fetch("/api/auth/logout", {
            method: "POST",
        }).catch(() => {})
        window.location.href = "/signin"
    }

    return (
        <section>
            <div className="grid grid-cols-2 gap-8">
                <div className="bg-blue-500 w-64 h-48 rounded-xl">
                    <h1 className="text-white text-2xl font-bold p-4">Get Your AI Avatars</h1>
                </div>
                <div className="bg-blue-500 w-64 h-48 rounded-xl">
                    <h1 className="text-white text-2xl font-bold p-4">Video Narration</h1>
                </div>
                <div className="bg-blue-500 w-64 h-48 rounded-xl">
                    <h1 className="text-white text-2xl font-bold p-4">Content Generation</h1>
                </div>
                <div className="bg-blue-500 w-64 h-48 rounded-xl">
                    <h1 className="text-white text-2xl font-bold p-4">AI enhancement</h1>
                </div>
            </div>
            <hr className="mb-8" />
            <p>You are Logged in</p>
            <br />
            <Button
                onClick={handleLogout}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Logout
            </Button>
        </section>
    )
}
