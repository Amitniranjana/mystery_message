'use client'
import React, { useState, useEffect } from 'react'
import axios, { AxiosError } from 'axios' // <-- Axios import kiya
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDebounce } from 'use-debounce';
const Signup = () => {
    const userdata = {
        gmail: "",
        username: "",
        password: "",
        gender: "",
        message: ""
    }
    const [isDebounceSearch, setIsDebounceSearch] = useState(false);
    const [isDebounceSearchMessage, setIsDebounceSearchMessage] = useState("");
    const [user, setUser] = useState(userdata);
    const [loading, setLoading] = useState(false); // Thoda better UX ke liye
    const router = useRouter();
    const saveData = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Axios ke sath POST request bhejna
            const response = await axios.post('/api/signup', user);

            if (response) {
                // Agar success hua (status 200/201)
                alert("User created successfully!");
                console.log("user created succesfull")
                setUser(userdata); // Form reset
                router.push("/user/signin")
            }


        } catch (error) {
            // Axios errors ko 'error.response' mein deta hai
            console.error("Signup failed:", error);
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data) {
                    // Server ne error bheja hai (jaise "User already exists")
                    alert("Error: " + error.response.data.message);
                } else {
                    // Network error ya server offline hai
                    alert("Something went wrong. Please check your connection.");
                }
            }
        } finally {
            setLoading(false);
        }
    }

    const [debouncedUsername] = useDebounce(user.username, 900);

    useEffect(() => {
if(!debouncedUsername.trim()){
    return;
}
const checkUsername = async()=>{

            setIsDebounceSearch(true);

            try {
const debounceResponse=await axios.post('/api/search-username' , {username:debouncedUsername});
setIsDebounceSearchMessage(debounceResponse.data.message)
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log('problem in debouncing username', AxiosError)
                } else {
                    console.log('something went wrong', error)
                }
            }
            finally{
            setIsDebounceSearch(false)

        }
    }
    checkUsername();
    }, [debouncedUsername])
    return (
        <form onSubmit={saveData}>
            <div className='flex flex-col justify-center items-center h-screen bg-gradient-to-r from-blue-700 to-red-500'>
                <div className='h-1/2 w-1/2 font-semibold text-black flex flex-col justify-center'>

                    <input placeholder='gmail' className='rounded-md my-1 px-2 py-1' value={user.gmail} onChange={(e) => setUser({ ...user, gmail: e.target.value })} type="email" required />
                    <input placeholder='username' className='rounded-md my-1 px-2 py-1' value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} type="text" required />
{isDebounceSearch ? <p className='text-red-600 font-semibold'> loading.... </p>: <p className='text-lime-50 font-semibold'>{isDebounceSearchMessage}</p> }

                    <input placeholder='password' className='rounded-md my-1 px-2 py-1' value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} type="password" required />
                    <input placeholder='gender' className='rounded-md my-1 px-2 py-1' value={user.gender} onChange={(e) => setUser({ ...user, gender: e.target.value })} type="text" />
                    <input placeholder='message' className='rounded-md my-1 px-2 py-1' value={user.message} onChange={(e) => setUser({ ...user, message: e.target.value })} type="text" />
<div className='flex flex-col justify-center items-center'>
                    <button
                        type="submit"
                        disabled={loading} // Jab submit ho raha ho toh button disable kar dein
                        className={`bg-gradient-to-r from-slate-500 to-red-600 w-fit px-7 py-3 rounded-3xl font-semibold transition-all duration-300 ease-in-out my-1 self-center ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gradient-to-r hover:from-green-600 hover:to-zinc-600 hover:-translate-y-1 active:translate-y-0'}`}
                    >
                        {loading ? 'Submitting...' : 'signup'}
                    </button>
 <p className='text-sm'>Already have an account <Link className='text-blue-700 font-extrabold underline ' href={"/user/signin"}>Signin</Link></p>

                    </div>

                </div>
            </div>
        </form>
    )
}

export default Signup;