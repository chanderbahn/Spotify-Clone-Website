"use client";
import React, { useContext } from "react";
import Image from "next/image";
import { supabase } from "@/lib/Client";
import { useQuery } from "@tanstack/react-query";
import DeleteButton from "./DeleteButton";
import { PlayerContext } from "@/layouts/FrontendLayout";

const UserSongs = ({ userId }) => {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("PlayerContext must be used within a PlayerProvider");
  }

  const { setQueue, setCurrentIndex } = context;

  const getUserSongs = async () => {
    const { data, error } = await supabase
      .from("songs")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("fetchUserSongsError:", error.message);
    }
    return data || [];
  };

  const {
    data: songs = [],
    isLoading,
    error,
    isError,
  } = useQuery({
    queryFn: getUserSongs,
    queryKey: ["usersongs"],
    enabled: !!userId, // prevents query if userId is undefined
  });

  const startPlayingSong = (songs, index) => {
    setQueue(songs); // set the entire queue
    setCurrentIndex(index); // set the song index
  };

  if (isLoading)
    return (
      <div>
         {[...Array(9)].map((i, index)=>(
          <div key={index} className='flex gap-2 animate-pulse mb-4'>
          <div className='w-10 h-10 rounded-md bg-hover'></div>
          <div className='h-5 w-[80%] rounded-md bg-hover'></div>
        </div>
        ))}
      </div>
    );

  if (isError) {
    return (
      <h2 className="text-center text-red-400 text-2xl">
        {error?.message || "Something went wrong"}
      </h2>
    );
  }

  

  return (
    <div>
      {songs.length === 0 ? (
        <p className="text-secondary-text">You have no songs in your library</p>
      ) : (
        songs.map((song, index) => (
          <div
            key={song.id}
            onClick={() => startPlayingSong(songs, index)}
            className="flex relative gap-2 items-center cursor-pointer mb-4 p-2 rounded-lg hover:bg-hover group"
          >
            <DeleteButton
              songId={song.id}
              imagePath={song.cover_image_url}
              audioPath={song.audio_url}
            />

            <Image
              src={song.cover_image_url}
              alt="cover-image"
              width={300}
              height={300}
              className="w-10 h-10 object-cover rounded-md"
            />

            <div>
              <p className="text-primary-text font-semibold">{song.title}</p>
              <p className="text-secondary-text text-sm">By {song.artist}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserSongs;
