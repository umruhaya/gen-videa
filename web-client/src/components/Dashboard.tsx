export default function DashboardComponent() {

    return (
        <section>
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
            <p>You are Logged in</p>
        </section>
    )
}
