"use client";
import { supabase } from "@/lib/Client";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";

const DeleteButton = ({ songId, imagePath, audioPath, userId }) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const deleteSong = async () => {
    if (loading) return; // prevent multiple clicks
    setLoading(true);

    // 1. Delete row in DB first
    const { error: deleteError } = await supabase
      .from("songs")
      .delete()
      .eq("id", songId);

    if (deleteError) {
      console.error("TableDeleteError:", deleteError.message);
      setLoading(false);
      return;
    }

    // 2. Delete image file (if exists)
    if (imagePath) {
      const { error: imgError } = await supabase
        .storage
        .from("cover-images")
        .remove([imagePath]);
      if (imgError) console.warn("ImageDeleteError:", imgError.message);
    }

    // 3. Delete audio file (if exists)
    if (audioPath) {
      const { error: audioError } = await supabase
        .storage
        .from("songs")
        .remove([audioPath]);
      if (audioError) console.warn("AudioDeleteError:", audioError.message);
    }

    // 4. Invalidate queries
    queryClient.invalidateQueries({ queryKey: ["allsongs"] });
    queryClient.invalidateQueries({ queryKey: ["usersongs"] });

    setLoading(false);
  };

  return (
    <button
      onClick={deleteSong}
      disabled={loading}
      className={`absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:block ${
        loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } text-secondary-text`}
    >
      <FaTrash />
    </button>
  );
};

export default DeleteButton;
