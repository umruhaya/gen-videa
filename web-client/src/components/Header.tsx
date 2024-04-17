import ModeToggle from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";

// Type definition for the Header component props
type HeaderProps = {
    isLoggedIn: boolean;
    showHomeButton?: boolean; 
}

// Header component accepting isLoggedIn status, optionally showing a home button
function Header({ isLoggedIn, showHomeButton = false }: HeaderProps = { isLoggedIn: true }) {

    // Function to handle user logout through a POST request and reload the page
    const handleLogout = async () => {
        const response = await fetch("/api/auth/logout", {
            method: "POST",
        })
            .catch(() => { }) // Catch and ignore any errors during logout
        window.location.reload(); // Reload the page to update the UI state
    }

    return (
        <header className="p-4 bg-secondary w-full">

            <nav className="flex justify-between items-center w-full">
                <div className="flex items-center space-x-4">
                <ModeToggle /> {/*Allows the user to toggle between light and dark mode.*/}
                {showHomeButton && (
                    <a href="/">
                        <Button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Home
                        </Button>
                    </a>
                )}
                </div>

                {isLoggedIn && (
                    <Button
                        data-testid="logout-btn"
                        onClick={handleLogout}
                        className="font-bold py-2 px-4 rounded"
                    >
                        Logout
                    </Button>
                )}
            </nav>

        </header>
    );
}
export default Header; // Export the Header for use in other parts of the application