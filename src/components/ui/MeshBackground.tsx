"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function MeshBackground() {
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            setMouse({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, []);

    return (
        <div className="absolute inset-0 -z-10 overflow-hidden bg-[#030303]">
            {/* Base refined gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1),rgba(3,3,3,1))]" />

            {/* Ethereal Floating Blobs */}
            <motion.div
                className="absolute w-[800px] h-[800px] bg-indigo-500/[0.08] rounded-full blur-[120px]"
                animate={{
                    x: [0, 50, -50, 0],
                    y: [0, -40, 40, 0],
                    scale: [1, 1.1, 0.9, 1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ top: "-10%", left: "10%" }}
            />

            <motion.div
                className="absolute w-[700px] h-[700px] bg-purple-500/[0.05] rounded-full blur-[100px]"
                animate={{
                    x: [0, -60, 60, 0],
                    y: [0, 50, -50, 0],
                    scale: [1, 0.9, 1.1, 1]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                style={{ bottom: "5%", right: "5%" }}
            />

            <motion.div
                className="absolute w-[600px] h-[600px] bg-blue-500/[0.06] rounded-full blur-[110px]"
                animate={{
                    x: [0, 40, -40, 0],
                    y: [0, -60, 60, 0]
                }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                style={{ top: "30%", left: "50%" }}
            />

            {/* Interactive Mouse Spotlight */}
            <motion.div
                className="pointer-events-none absolute w-[600px] h-[600px] rounded-full bg-indigo-500/[0.07] blur-[100px]"
                animate={{
                    left: mouse.x - 300,
                    top: mouse.y - 300,
                }}
                transition={{ type: "spring", damping: 30, stiffness: 150 }}
            />

            {/* Subtle Texture/Grain */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Refined Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>
    );
}
