"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { LuPlus } from 'react-icons/lu'
import { MdOutlineLibraryMusic } from 'react-icons/md'
import useUserSession from '@/custom-hooks/useUserSession'
import UserSongs from './UserSongs'

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { loading, session } = useUserSession()

  const user_id = session?.user.id;

  if (loading) {
    return (
      <aside className={`fixed left-2 top-15 bg-background w-75 rounded-lg h-[90vh] p-2 overflow-y-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-500 lg:translate-x-0`}>

        <div className="flex justify-between text-primary-text items-center p-2 mb-4">
          <h2 className="font-bold">Your Library</h2>
          <Link href="upload-songs">
            <LuPlus size={20} />
          </Link>
        </div>

        {[...Array(9)].map((i, index)=>(
          <div key={index} className='flex gap-2 animate-pulse mb-4'>
          <div className='w-10 h-10 rounded-md bg-hover'></div>
          <div className='h-5 w-[80%] rounded-md bg-hover'></div>
        </div>
        ))}
      </aside>
    )
  }

  return (
    <>
     {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {session ? (
        // Show library when logged in
        <div>
          <aside className={`fixed left-2 top-15 bg-background w-75 rounded-lg h-[90vh] p-2 overflow-y-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-500 lg:translate-x-0 z-50`}>
            <div className="flex justify-between text-primary-text items-center p-2 mb-4">
              <h2 className="font-bold">Your Library</h2>
              <Link href="upload-songs">
                <LuPlus size={20} />
              </Link>
            </div>

            <UserSongs userId={user_id} />

          </aside>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed bottom-5 left-4 bg-background w-12 h-12 lg:hidden grid place-items-center text-white rounded-lg z-50 cursor-pointer"
          >
            <MdOutlineLibraryMusic />
          </button>
        </div>
      ) : (
        //  Show login prompt when NOT logged in
        <div>
          <aside className={`fixed left-2 top-15 bg-background w-75 rounded-lg h-[90vh] p-2 overflow-y-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-500 lg:translate-x-0 z-50`}>
            <div className="py-8 text-center">
              <Link href="/login" className="bg-white px-6 py-2 rounded-full font-semibold hover:text-secondary-text">Login</Link>
              <p className="mt-4 text-white">Login to view your Library</p>
            </div>
          </aside>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed bottom-5 left-5 bg-background w-12 h-12 lg:hidden grid place-items-center text-white rounded-lg z-50 cursor-pointer"
          >
            <MdOutlineLibraryMusic />
          </button>
        </div>
      )}
    </>
  )
}

export default Sidebar
