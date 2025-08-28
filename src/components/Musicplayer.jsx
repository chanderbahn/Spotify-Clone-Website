"use client"
import React, { useRef, useState, useEffect, useContext } from "react";
import Image from 'next/image'
import { IoMdPause, IoMdPlay, IoMdSkipBackward, IoMdSkipForward, IoMdVolumeHigh, IoMdVolumeOff } from 'react-icons/io'
import { LuRepeat, LuRepeat1 } from 'react-icons/lu'
import { MdOutlineQueueMusic } from 'react-icons/md'
import { PlayerContext } from "@/layouts/FrontendLayout";

const Musicplayer = () => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [previousVolume, setPreviousVolume] = useState(50);

    // repeatMode: "off" | "all" | "one"
    const [repeatMode, setRepeatMode] = useState("off");

    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error("PlayerContext must be within a provider");
    }

    const { isQueueModalOpen, setQueueModalOpen, currentMusic, playNext, playPrev } = context;

    /** ▶ Play / Pause */
    const toggleButton = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    /** 🔊 Toggle Mute */
    const toggleMute = () => {
        if (volume === 0) {
            setVolume(previousVolume);
            if (audioRef.current) {
                audioRef.current.volume = previousVolume / 100;
            }
        } else {
            setPreviousVolume(volume);
            setVolume(0);
            if (audioRef.current) {
                audioRef.current.volume = 0;
            }
        }
    };

    /** 🔊 Volume Handler */
    const handleVolume = (e) => {
        const vol = parseInt(e.target.value);
        setVolume(vol);
        if (audioRef.current) {
            audioRef.current.volume = vol / 100;
        }
    };

    /** ⏩ Seek Handler */
    const handleSeek = (e) => {
        const newTime = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    /** 🎵 Progress Listener */
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => {
            setCurrentTime(audio.currentTime);
            setDuration(audio.duration || 0);
        };

        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("loadedmetadata", updateTime);

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("loadedmetadata", updateTime);
        };
    }, []);

    /** 🔊 Sync Volume */
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    /** ▶ Autoplay when currentMusic changes */
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentMusic) return;

        // reset state
        audio.currentTime = 0;
        setCurrentTime(0);
        setDuration(0);

        const playAudio = async () => {
            try {
                await audio.play();
                setIsPlaying(true);
            } catch (error) {
                console.log("AudioPlay Error:", error);
                setIsPlaying(false);
            }
        };
        playAudio();
    }, [currentMusic]);

    /** 🔁 Auto play next when song ends */
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleEnded = () => {
            if (repeatMode === "one") {
                audio.currentTime = 0;
                audio.play();
            } else if (repeatMode === "all") {
                playNext();
            }
        };

        audio.addEventListener("ended", handleEnded);
        return () => audio.removeEventListener("ended", handleEnded);
    }, [repeatMode, playNext]);

    /** 🔁 Toggle Repeat Mode */
    const toggleRepeat = () => {
        if (repeatMode === "off") setRepeatMode("all");
        else if (repeatMode === "all") setRepeatMode("one");
        else setRepeatMode("off");
    };

    /** ⏱ Format Time */
    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const minute = Math.floor(time / 60);
        const second = Math.floor(time % 60).toString().padStart(2, "0");
        return `${minute}:${second}`;
    };

    if (!currentMusic) return null;

    return (
        <div className='fixed bottom-0 left-0 w-full bg-black text-white px-4 py-3 shadow-md z-50'>
            <audio src={currentMusic.audio_url || ""} ref={audioRef}></audio>

            <div className='max-w-8xl w-[95%] mx-auto flex items-center justify-between'>

                {/* 🎵 Song Info */}
                <div className='flex gap-4 items-center'>
                    <Image src={currentMusic.cover_image_url || ""} alt='cover-image' width={50} height={50} className='w-13 h-13 object-cover rounded-md' />
                    <div className='text-sm'>
                        <p className='text-white'>{currentMusic.title}</p>
                        <p className='text-secondary-text font-normal'>{currentMusic.artist}</p>
                    </div>
                </div>

                {/* ▶ Controls */}
                <div className='max-w-[400px] w-full flex items-center flex-col gap-3'>
                    <div className='flex gap-4'>
                        <button onClick={playPrev} className='text-xl text-secondary-text cursor-pointer'>
                            <IoMdSkipBackward />
                        </button>
                        <button
                            onClick={toggleButton}
                            className='bg-white text-xl text-black w-10 h-10 rounded-full grid place-items-center cursor-pointer'
                        >
                            {isPlaying ? <IoMdPause /> : <IoMdPlay />}
                        </button>
                        <button onClick={playNext} className='text-xl text-secondary-text cursor-pointer'>
                            <IoMdSkipForward />
                        </button>
                    </div>

                    {/* 📊 Progress Bar */}
                    <div className='w-full flex justify-center items-center gap-2'>
                        <span className='text-secondary-text font-normal text-sm'>
                            {formatTime(currentTime)}
                        </span>
                        <div className='w-full'>
                            <input
                                onChange={handleSeek}
                                type="range"
                                min="0"
                                max={duration}
                                value={currentTime}
                                className='w-full outline-none h-1 bg-zinc-700 rounded-md appearance-none accent-white cursor-pointer'
                            />
                        </div>
                        <span className='text-secondary-text font-normal text-sm'>
                            {formatTime(duration)}
                        </span>
                    </div>
                </div>

                {/* ⚙ Extra Controls */}
                <div className='flex items-center gap-2'>
                    {/* 🔁 Repeat Button */}
                    <button onClick={toggleRepeat} className='text-xl'>
                        {repeatMode === "one" ? (
                            <LuRepeat1 className="text-green-500" />
                        ) : repeatMode === "all" ? (
                            <LuRepeat className="text-green-500" />
                        ) : (
                            <LuRepeat className="text-secondary-text" />
                        )}
                    </button>

                    {/* 📋 Queue Button */}
                    <button onClick={() => setQueueModalOpen(!isQueueModalOpen)} className='text-secondary-text text-xl cursor-pointer'>
                        <MdOutlineQueueMusic />
                    </button>

                    {/* 🔊 Volume */}
                    {volume === 0 ? (
                        <button onClick={toggleMute} className='text-secondary-text text-xl cursor-pointer'>
                            <IoMdVolumeOff />
                        </button>
                    ) : (
                        <button onClick={toggleMute} className='text-secondary-text text-xl cursor-pointer'>
                            <IoMdVolumeHigh />
                        </button>
                    )}
                    <input
                        onChange={handleVolume}
                        value={volume}
                        type="range"
                        min="0"
                        max="100"
                        className='w-[100px] outline-none h-1 bg-zinc-700 accent-white appearance-none cursor-pointer'
                    />
                </div>
            </div>
        </div>
    );
};

export default Musicplayer;
