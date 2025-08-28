"use client";
import React, { useContext } from "react";
import Image from "next/image";
import { PlayerContext } from "@/layouts/FrontendLayout";

const Queue = () => {
    const context = useContext(PlayerContext);

    if (!context) {
        throw new Error("PlayerContext must be used within a provider");
    }

    const { isQueueModalOpen, currentMusic, currentIndex, queue, setCurrentIndex,setQueue } = context;

     const startPlayingSong = (songs, index) => {
    setQueue(songs); // set the entire queue
    setCurrentIndex(index); // set the song index
  };

    if (!isQueueModalOpen) return null;

    

    return (
        <div className="fixed top-18 right-15 z-50 max-w-[300px] w-full h-[75vh] bg-black border border-gray-800 p-4 overflow-y-auto rounded-md shadow-lg">
            <h2 className="text-white text-lg font-bold">Queue</h2>

            {/* Now Playing */}
            <div className="mt-6">
                <h3 className="text-white font-semibold mb-3">Now Playing</h3>
                {currentMusic && (
                    <div className="flex items-center gap-2 cursor-pointer mb-2 p-2 rounded-lg bg-gray-900">
                        <Image
                            src={currentMusic.cover_image_url}
                            alt="queue-image"
                            width={300}
                            height={300}
                            className="w-10 h-10 object-cover rounded-md"
                        />
                        <div>
                            <p className="text-primary font-semibold">{currentMusic.title}</p>
                            <p className="text-sm text-secondary-text">{currentMusic.artist}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Queue List */}
            <div className="mt-6">
                <h3 className="text-white font-semibold mb-3">Up Next</h3>
                {queue.map((song, index) => (
                    <div
                        key={song.id}
                        onClick={() => startPlayingSong(queue,index)} // click to play this song
                        className={`flex items-center gap-2 cursor-pointer mb-2 p-2 rounded-lg hover:bg-gray-800 transition ${index === currentIndex ? "bg-gray-700" : ""
                            }`}
                    >
                        <Image
                            src={song.cover_image_url}
                            alt="queue-image"
                            width={300}
                            height={300}
                            className="w-10 h-10 object-cover rounded-md"
                        />
                        <div>
                            <p className="text-white font-semibold">{song.title}</p>
                            <p className="text-sm text-secondary-text">{song.artist}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Queue;
