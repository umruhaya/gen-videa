// Import ModeToggle component for theme switching and Button from UI components
import ModeToggle from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";

// Define the props for the Header component, including optional showHomeButton
type HeaderProps = {
    isLoggedIn: boolean;
    showHomeButton?: boolean; 
}

// Header component that displays the top navigation bar
function Header({ isLoggedIn, showHomeButton = false }: HeaderProps = { isLoggedIn: true }) {

    const handleLogout = async () => {
        // Attempt to log the user out via a POST request to the logout API endpoint
        const response = await fetch("/api/auth/logout", {
            method: "POST",
        })
            .catch(() => { })
        // Reload the page to reflect the logout state
        window.location.reload();
    }

    return (
        <header className="p-4 bg-secondary w-full">

            <nav className="flex justify-between items-center w-full">
                <div className="flex items-center space-x-4">
                {/* Mode toggle switch for dark/light theme */}
                <ModeToggle />
                {/* Conditional rendering of the Home button based on showHomeButton prop */}
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
                
                {/* Conditional rendering of the Logout button if the user is logged in */}
                {isLoggedIn && (
                    <Button
                        data-testid="logout-btn"
                        onClick={handleLogout}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Logout
                    </Button>
                )}
            </nav>

        </header>
    );
}
// Export the Header component for use in other parts of the application
export default Header;