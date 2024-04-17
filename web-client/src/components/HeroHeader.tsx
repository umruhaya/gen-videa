import { Button } from "@/components/ui/moving-border.tsx";

export default function HeroHeader() {
    // The HeroHeader function component returns a header section typically used on the landing page of a website
    return (
        <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
            <h1 className="text-2xl md:text-7xl font-bold dark:text-white">
                Welcome to GenVidea <br /> Your AI Powered Multimodal Studio
            </h1>
            <p className="max-w-2xl text-base md:text-xl my-8 dark:text-neutral-200">
                Explore the new dimensions of content creation with GenVidea. Our platform now specializes in multimodal AI technologies, enabling you to interact with and understand media through advanced features like captioning, Q&A, and summarization for both videos and images. Additionally, we offer exclusive tools for generating high-quality images. Embrace the synergy of creativity and AI, and transform the way you engage with digital content.
            </p>
            <div className="flex justify-center space-x-4">
                <a href="/signin">
                    <Button
                        borderRadius="1.75rem"
                        className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800 z-50"
                    >
                        Get Started
                    </Button>
                </a>
            </div>
        </div>
    );
};
