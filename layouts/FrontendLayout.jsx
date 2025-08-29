"use client";
import Musicplayer from "@/src/components/Musicplayer";
import Navbar from "@/src/components/Navbar";
import Queue from "@/src/components/Queue";
import Sidebar from "@/src/components/Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";

export const PlayerContext = createContext();

const FrontendLayout = ({ children }) => {
    // const queryClient = new QueryClient(); 
    const [queryClient] = useState(() => new QueryClient());
    
    const [isQueueModalOpen, setQueueModalOpen] = useState(false);
    const [currentMusic, setCurrentMusic] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [queue, setQueue] = useState([]);

    const playNext = () => {
        if (currentIndex < queue.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    };

    const playPrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
        }
    };

    useEffect(() => {
        if (queue.length > 0 && currentIndex >= 0 && currentIndex < queue.length) {
            setCurrentMusic(queue[currentIndex]);
        } else {
      setCurrentMusic(null);
    }
    }, [queue, currentIndex]);

    return (
        <QueryClientProvider client={queryClient}>
            <PlayerContext.Provider
                value={{
                    isQueueModalOpen,
                    setQueueModalOpen,
                    currentMusic,
                    setCurrentIndex,
                    queue,
                    setQueue,
                    playNext,
                    playPrev,
                    setCurrentIndex,
                    currentIndex
                }}
            >
                <div className="min-h-screen">
                    <Navbar />
                    <main>
                        <Sidebar />
                        <Queue />
                        {currentMusic && <Musicplayer />}
                        {children}
                    </main>
                </div>
            </PlayerContext.Provider>
        </QueryClientProvider>
    );
};

export default FrontendLayout;
