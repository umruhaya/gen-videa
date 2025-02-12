import ModeToggle from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { queryOptions, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/store/query-client";
import axios from "axios";

type HeaderProps = {
    isLoggedIn: boolean;
    showHomeButton?: boolean; 
}

function Header({ isLoggedIn, showHomeButton = false }: HeaderProps = { isLoggedIn: true }) {

    const logout = useMutation({
        mutationKey: ["logout"],
        mutationFn: () => axios.post("/api/auth/logout"),
        onSettled: () => {
            window.location.reload()
        }
    }, queryClient)

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
                        onClick={() => logout.mutate()}
                        className="font-bold py-2 px-4 rounded"
                    >
                        Logout
                    </Button>
                )}
            </nav>

        </header>
    );
}
export default Header;