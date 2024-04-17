import { cn } from "@/lib/utils";
import { motion, MotionValue } from "framer-motion";

const transition = {
    duration: 0,
    ease: "linear",
};

export const GoogleGeminiEffect = ({
    pathLengths,
    title,
    description,
    className,
    children,
}: {
    pathLengths: MotionValue[];
    title?: string;
    description?: string;
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div className={cn("", className)}>
            {children}
            <svg width="1220" height="1687" viewBox="0 0 1220 1687" className="pointer-events-none absolute left-10  top-28 hidden select-none md:block" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 1686.5L2 1607C2 1589.33 16.3269 1575 34 1575L1186 1575C1203.67 1575 1218 1560.67 1218 1543L1218 795.001C1218 777.327 1203.67 763.001 1186 763.001L34.021 763.001C16.3397 763.001 2.00945 748.661 2.02104 730.98L2.50015 -0.000122048" stroke="#3887FD" strokeOpacity="0.15" strokeWidth="5"

                />
                <motion.path d="M2 1686.5L2 1607C2 1589.33 16.3269 1575 34 1575L1186 1575C1203.67 1575 1218 1560.67 1218 1543L1218 795.001C1218 777.327 1203.67 763.001 1186 763.001L34.021 763.001C16.3397 763.001 2.00945 748.661 2.02104 730.98L2.50015 -0.000122048" stroke="#3b82f6" strokeOpacity="1" strokeLinecap="round" strokeWidth="5" pathLength="1" strokeDashoffset="0px" strokeDasharray="0.06040861402540034px 1px"
                    initial={{
                        pathLength: 0,
                    }}
                    style={{
                        pathLength: pathLengths[0],
                    }}
                    transition={transition}
                />
            </svg>

        </div>
    );
};
