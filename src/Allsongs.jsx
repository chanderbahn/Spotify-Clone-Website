"use client";
import React, { useContext } from "react";
import Image from "next/image";
import { IoMdPlay } from "react-icons/io";
import { supabase } from "@/lib/Client";
import { useQuery } from "@tanstack/react-query";
import { PlayerContext } from "@/layouts/FrontendLayout";

const Allsongs = () => {
  // ✅ useContext should be here, not inside getAllSongs
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("PlayerContext must be used within a PlayerProvider");
  }

  const { setQueue, setCurrentIndex } = context;


  const getAllSongs = async () => {
    const { data, error } = await supabase.from("songs").select("*");
    if (error) {
      console.error("fetchAllSongsError:", error.message);
      throw new Error(error.message);
    }
    return data || [];
  };

  const {
    data: songs = [],
    isLoading,
    error,
    isError,
  } = useQuery({
    queryFn: getAllSongs,
    queryKey: ["allsongs"],
  });


  const startPlayingSong = (songs, index) => {
    setQueue(songs);       // set the full queue
    setCurrentIndex(index); // set current song index
  };

  if (isLoading)
    return (
      <div className="min-h-[90vh] bg-background my-15 p-4 lg:ml-80 rounded-lg mx-4">
        <h2 className="text-2xl text-white mb-3 font-semibold">New Songs</h2>
        <div className="animate-pulse grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

          {[...Array(10)].map((i, index) => (
            <div key={index}>
              <div className="w-full h-50 rounded-md mb-2 bg-hover"></div>
              <div className="h-3 w-[80%] rounded-md bg-hover"></div>
            </div>
          ))}

        </div>
      </div>
    );

  if (isError)
    return (
      <div className="min-h-[90vh] bg-background my-15 p-4 lg:ml-80 rounded-lg mx-4">
        <h2 className="text-2xl text-white mb-3 font-semibold">New Songs</h2>
        <h2 className="text-center text-red-400 text-2xl">
          {error?.message || "Something went wrong"}
        </h2>
      </div>
    );

  return (
    <div className="min-h-[90vh] bg-background my-15 p-4 lg:ml-80 rounded-lg mx-4">
      <h2 className="text-2xl text-white mb-3 font-semibold">New Songs</h2>
      <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {songs.map((song, index) => (
          <div
            key={song.id || index}
            onClick={() => startPlayingSong(songs, index)}
            className="relative bg-background p-3 cursor-pointer rounded-md hover:bg-hover group"
          >
            <button className="bg-primary w-12 h-12 rounded-full grid place-items-center absolute bottom-8 right-5 opacity-0 group-hover:opacity-100 group-hover:bottom-20 transition-all duration-300 ease-in-out">
              <IoMdPlay />
            </button>
            <Image
              src={song.cover_image_url}
              alt="cover-image"
              width={500}
              height={500}
              className="w-full h-50 object-cover rounded-md"
            />
            <div className="mt-2">
              <p className="text-primary-text font-semibold">{song.title}</p>
              <p className="text-secondary-text text-sm">By {song.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Allsongs;
