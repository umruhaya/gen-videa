import ModeToggle from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";

type HeaderProps = {
    isLoggedIn: boolean;
    showHomeButton?: boolean; 
}

function Header({ isLoggedIn, showHomeButton = false }: HeaderProps = { isLoggedIn: true }) {

    const handleLogout = async () => {
        const response = await fetch("/api/auth/logout", {
            method: "POST",
        })
            .catch(() => { })
        window.location.reload();
    }

    return (
        <header className="p-4 bg-secondary w-full">

            <nav className="flex justify-between items-center w-full">
                <div className="flex items-center space-x-4">
                <ModeToggle />
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
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Logout
                    </Button>
                )}
            </nav>

        </header>
    );
}
export default Header;