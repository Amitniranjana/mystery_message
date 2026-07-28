'use client'
import React from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
const Dashboard = () => {
  const router=useRouter()
  const logoutPage = async() => {
    try {
    const response = await axios.post('/api/logout');
    if(response){
      router.refresh();
    }
    alert(response.data.message)
    } catch (err) {
      alert("logout Error" + err);
    }
  }
  return (
    <div>
      <div>
        <h1>Dashboard</h1>
        <button className='px-7 py-3  rounded-full font-semibold bg-gradient-to-r from-red-500 transition-all duration-300 ease-in-out  to-green-500 hover:-translate-y-2 hover:bg-gradient-to-r hover:from-green-700 hover:to-orange-500 active:translate-y-0'
          onClick={logoutPage}>logout</button>

      </div>
    </div>


  )
};
export default Dashboard