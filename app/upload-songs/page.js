"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/Client";
import { useRouter } from "next/navigation";
import useUserSession from "@/custom-hooks/useUserSession";

const Page = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { session } = useUserSession();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/");
      } else {
        setPageLoading(false);
      }
    });
  }, [router]);

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!title.trim() || !artist.trim() || !audioFile || !imageFile) {
      setMessage("All fields are required!");
      setLoading(false);
      return;
    }

    try {
      const timestamp = Date.now();

      //  Upload Image
      const imagePath = `${timestamp}_${imageFile.name}`;
      const { error: imgError } = await supabase.storage
        .from("cover-images")
        .upload(imagePath, imageFile);

      if (imgError) {
        setMessage(imgError.message);
        setLoading(false);
        return;
      }

      const { data: imageData } = supabase.storage
        .from("cover-images")
        .getPublicUrl(imagePath);
      const imageURL = imageData.publicUrl;

      //  Upload Audio
      const audioPath = `${timestamp}_${audioFile.name}`;
      const { error: audioError } = await supabase.storage
        .from("songs")
        .upload(audioPath, audioFile);

      if (audioError) {
        setMessage(audioError.message);
        setLoading(false);
        return;
      }

      const { data: audioData } = supabase.storage
        .from("songs")
        .getPublicUrl(audioPath);
      const audioURL = audioData.publicUrl;

      //  Insert into DB
      const { error: insertError } = await supabase.from("songs").insert([
        {
          title,
          artist,
          cover_image_url: imageURL,
          audio_url: audioURL,
          user_id: session?.user.id,
        },
      ]);

      if (insertError) {
        setMessage(insertError.message);
        setLoading(false);
        return;
      }

      // Reset form
      setTitle("");
      setArtist("");
      setImageFile(null);
      setAudioFile(null);
      setMessage("Song Uploaded successfully");

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      console.error("Catched error", err);
      setMessage("Something went wrong while uploading.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return null;

  return (
    <div className="h-screen flex justify-center items-center w-full bg-hover">
      <div className="bg-background flex flex-col items-center px-6 lg:px-12 py-6 rounded-md max-w-[400px] w-[90%]">
        <Image
          src="/images/logo.png"
          alt="logo"
          width={500}
          height={500}
          className="h-11 w-11"
        />
        <h2 className="text-2xl font-bold text-white my-2 mb-8 text-center">
          Upload songs to Spotify
        </h2>
        <form onSubmit={handleUpload}>
          {message && (
            <p className="bg-primary font-semibold text-center mb-4 py-1">
              {message}
            </p>
          )}

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Title"
            className="outline-none border-1 border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"
          />

          <input
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            type="text"
            placeholder="Artist"
            className="outline-none border-1 border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"
          />

          <label htmlFor="audio" className="block py-2 text-secondary-text">
            Audio
          </label>
          <input
            accept="audio/*"
            type="file"
            id="audio"
            onChange={(e) => {
              const files = e.target.files;
              if (!files) return;
              setAudioFile(files[0]);
            }}
            className="outline-none border-1 border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"
          />

          <label htmlFor="cover" className="block py-2 text-secondary-text">
            Cover Image
          </label>
          <input
            accept="image/*"
            type="file"
            id="cover"
            onChange={(e) => {
              const files = e.target.files;
              if (!files) return;
              setImageFile(files[0]);
            }}
            className="outline-none border-1 border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"
          />

          {loading ? (
            <button className="bg-primary py-3 rounded-full w-full font-bold cursor-pointer">
              Uploading...
            </button>
          ) : (
            <button className="bg-primary py-3 rounded-full w-full font-bold cursor-pointer">
              Add Song
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Page;
