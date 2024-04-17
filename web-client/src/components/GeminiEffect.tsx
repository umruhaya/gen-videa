"use client";
import { useScroll, useTransform } from "framer-motion";
import React, { useEffect } from "react";
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";
import FeatureCards from "./FeatureCard";

export default function GeminiEffect() {
    const ref = React.useRef(null);
    // Initializes scroll-based animations, binding them to the ref element's scroll progress.
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    // Defines the path length transitions as a function of scroll progress, optimized through experimental adjustments.
    // got these values from trial and error :)
    const pathLengthFirst = useTransform(scrollYProgress, [0.05, 0.08, 0.1, 0.3, 0.35, 0.45], [1, 0.85, 0.6, 0.35, 0.1, 0]);

    // Periodically logs the scroll progress to the console for debugging and monitoring purposes.
    useEffect(() => {
        setInterval(() => {
            console.log(scrollYProgress.get());
        }, 500)
    }, [])

    return (
        <div
            className="pt-20 h-[500vh] bg-black w-full dark:border dark:border-white/[0.1] rounded-md relative overflow-clip"
            ref={ref}
        >
            <GoogleGeminiEffect
                title="Genvidea"
                description="Genvidea is a platform for developers to share their projects and ideas."
                pathLengths={[
                    pathLengthFirst,
                ]}
            >
                <div className="mx-32">
                    <FeatureCards />
                </div>
            </GoogleGeminiEffect>
        </div>
    );
}
