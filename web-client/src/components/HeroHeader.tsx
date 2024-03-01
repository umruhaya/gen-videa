import { Button } from "@/components/ui/moving-border.tsx";

export default function HeroHeader() {
    return (
        <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
            <h1 className="text-2xl md:text-7xl font-bold dark:text-white">
                Welcome to GenVidea <br /> Your AI-Powered Video Studio
            </h1>
            <p className="max-w-2xl text-base md:text-xl my-8 dark:text-neutral-200">
                Revolutionize your video content with GenVidea. Utilizing cutting-edge AI,
                we empower you to enhance, generate, and narrate videos with ease.
                Dive into a world where creativity meets technology, and bring your
                vision to life without the need for advanced editing skills.
            </p>
            <div className="flex justify-center space-x-4"> {/* Adjusted for multiple buttons */}
                <a href="/signup">
                    <Button
                        borderRadius="1.75rem"
                        className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                    >
                        Get Started
                    </Button>
                </a>
                <a href="/profile">
                    <Button
                        borderRadius="1.75rem"
                        className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                    >
                        Profile
                    </Button>
                </a>
                <a href="/upload"> {/* This is the new button */}
                    <Button
                        borderRadius="1.75rem"
                        className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                    >
                        Upload
                    </Button>
                </a>
                <a href="/UserSettings"> {/* User Settings*/}
                    <Button
                        borderRadius="1.75rem"
                        className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                    >
                        Settings
                    </Button>
                </a>
            </div>
        </div>
    );
};
