
"use client"

import React, { useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Signin = () => {
    const router = useRouter();
    const newUser = {
        gmail: "",
        password: ""
    }
    const [user, setUser] = useState(newUser);
    const [loading, setLoading] = useState(false);
    const saveData = async (e) => {
        e.preventDefault();
        console.log(user);
        setUser(user);
        try {
            setLoading(true)
            const response = await axios.post('/api/signin', user);
            if (response) {
                alert("user signed successfully")
                console.log(response);
                router.push("/user/dashboard")

            }


        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.data?.message) {
                    alert("Error " + err.response?.data?.message);
                }
            }
            console.log(err);


        } finally {
            setLoading(false)
        }


    }
    return (
        <form onSubmit={saveData}>
            <div className='flex flex-col justify-center items-center h-screen bg-gradient-to-r from-blue-700 to-red-500'>
                <div className='h-1/2 w-1/2 font-semibold text-black flex flex-col justify-center'>

                    <input placeholder='gmail' className='rounded-md my-1 px-2 py-1' value={user.gmail} onChange={(e) => setUser({ ...user, gmail: e.target.value })} type="email" required />

                    <input placeholder='password' className='rounded-md my-1 px-2 py-1' value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} type="password" required />


                    <button
                        type="submit"
                        disabled={loading} // Jab submit ho raha ho toh button disable kar dein
                        className={`bg-gradient-to-r from-slate-500 to-red-600 w-fit px-7 py-3 rounded-3xl font-semibold transition-all duration-300 ease-in-out my-1 self-center ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gradient-to-r hover:from-green-600 hover:to-zinc-600 hover:-translate-y-1 active:translate-y-0'}`}
                    >
                        {loading ? 'Submitting...' : 'signin'}
                    </button>
                </div>
            </div>
        </form>

    )
}

export default Signin