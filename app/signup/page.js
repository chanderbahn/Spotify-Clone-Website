"use client"
import Image from 'next/image'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from "next/navigation";
import signUpUser from '@/lib/auth/signUPUser'
import { supabase } from '@/lib/Client'

const Page = () => {

    const router = useRouter();
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")

    const [loading, setLoading] = useState(true)
        
            useEffect(() => {
                supabase.auth.getSession().then(({ data }) => {
                    if (data.session) {
                        router.push("/")
                    }
                    else{
                        setLoading(false)
                    }
                })
            }, [router])

    const handleSignup = async (e) => {
         e.preventDefault();

         if(!name.trim() || !email.trim() || !password.trim()){
            setMessage("All field are required!");
            return;
         }
         const result= await signUpUser(name, email, password);
         if(result?.error){
            setMessage(result.error)
         }else{
            setMessage("SignUp Successful");
            setTimeout(() => {
                router.push("/");
            }, 2000);
         }
         
    }

    if(loading) return null;

    return (
        <div className='h-screen flex justify-center items-center w-full bg-hover'>
            <div className='bg-background flex flex-col items-center px-6 lg:px-12 py-6 rounded-md max-w-[400px] w-[90%]'>
                <Image src="/images/logo.png" alt='logo' width={500} height={500} className='h-11 w-11 ' />
                <h2 className='text-2xl font-bold text-white my-2 mb-8 text-center'>Signup to spotify</h2>
                <form onSubmit={handleSignup}>

                    {message && <p className='bg-primary font-semibold text-center mb-4 py-1'>{message}</p>}

                    <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Your Name' className='outline-none border-1 border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text' />
                    <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" placeholder='Your Email' className='outline-none border-1 border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text' />
                    <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='Your Password' className='outline-none border-1 border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text' />
                    <button className='bg-primary py-3 rounded-full w-full font-bold cursor-pointer'>Continue</button>
                    <div className='text-secondary-text text-center my-6'>
                        <span>Already have an account?</span>
                        <Link href="login" className='ml-2 text-white underline hover:text-primary'>Signin now</Link>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default Page