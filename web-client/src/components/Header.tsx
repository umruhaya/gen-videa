import ModeToggle from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";

type HeaderProps = {
    isLoggedIn: boolean;
}

function Header({ isLoggedIn }: HeaderProps = { isLoggedIn: true }) {

    const handleLogout = async () => {
        const response = await fetch("/api/auth/logout", {
            method: "POST",
        })
            .catch(() => { })
        window.location.reload();
    }

    return (
        <header className="p-4 flex bg-secondary">

            <nav className="Nav px-4 py-2 flex justify-between items-center w-full">
                <ModeToggle />

                {isLoggedIn && <div className="flex items-center">
                    <Button
                        onClick={handleLogout}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Logout
                    </Button>
                </div>}
            </nav>

        </header>
    );
}
export default Header;