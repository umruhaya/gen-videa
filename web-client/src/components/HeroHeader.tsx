// Import the Button component with a moving border effect from the UI components library
import { Button } from "@/components/ui/moving-border.tsx";

// HeroHeader component that serves as the main introductory section of the page
export default function HeroHeader() {
    return (
        <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
            {/* Main headline introducing GenVidea */}
            <h1 className="text-2xl md:text-7xl font-bold dark:text-white">
                Welcome to GenVidea <br /> Your AI-Powered Video Studio
            </h1>
            {/* Description paragraph highlighting the value proposition of GenVidea */}
            <p className="max-w-2xl text-base md:text-xl my-8 dark:text-neutral-200">
                Revolutionize your video content with GenVidea. Utilizing cutting-edge AI,
                we empower you to enhance, generate, and narrate videos with ease.
                Dive into a world where creativity meets technology, and bring your
                vision to life without the need for advanced editing skills.
            </p>
            {/* Buttons for user actions: signing up and logging in */}
            <div className="flex justify-center space-x-4">
                {/* Link to the signup page wrapped around the Get Started button */}
                <a href="/signup">
                    <Button
                        borderRadius="1.75rem"
                        className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                    >
                        Get Started
                    </Button>
                </a>
                {/* Link to the signin page wrapped around the Login button */}
                <a href="/signin">
                    <Button
                        borderRadius="1.75rem"
                        className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                        
                    >
                        Login
                    </Button>
                </a>
            </div>
        </div>
    );
};
