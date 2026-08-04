'use client'
import React, { useState } from 'react'
import axios from 'axios';

import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter()
  const [geminiRes, setGeminiRes] = useState(['you love tech'])

  // logout feature
  const logoutPage = async () => {
    try {
      const response = await axios.post('/api/logout');
      if (response) {
        router.refresh();
      }
      alert(response.data.message)
    } catch (err) {
      alert("logout Error" + err);
    }
  }

  // generate suggestion
  const generateResponse = async(e) => {
try{
const geminiResponse=await axios.post('/api/suggestmessages');
let suggesstedMessage=geminiResponse.data.data
if(typeof suggesstedMessage ==="string"){
  suggesstedMessage=JSON.parse(suggesstedMessage)
}
setGeminiRes(suggesstedMessage);
}catch(err){
console.log(err)
}
  }
  return (
    <div>
      <div>
        <h1>Dashboard</h1>
        <button className='px-7 py-3  rounded-full font-semibold bg-gradient-to-r from-red-500 transition-all duration-300 ease-in-out  to-green-500 hover:-translate-y-2 hover:bg-gradient-to-r hover:from-green-700 hover:to-orange-500 active:translate-y-0'
          onClick={logoutPage}>logout</button>

      </div>
      <button className='px-7 py-3  rounded-full font-semibold bg-gradient-to-r from-red-500 transition-all duration-300 ease-in-out  to-green-500 hover:-translate-y-2 hover:bg-gradient-to-r hover:from-green-700 hover:to-orange-500 active:translate-y-0'
        onClick={generateResponse}>submit</button>
        <div>
          {
            geminiRes.map((message,idx)=>(
              <div className='border border-gray-800 rounded-xl bg-slate-400 ' key={idx}>
                {message}
              </div>

            ))
          }
        </div>

    </div>


  )
};
export default Dashboard


// 'use client'
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// const Dashboard = () => {
//   const router = useRouter();

//   // State ko array type kar diya taaki list render karne me asani ho
//   const [suggestions, setSuggestions] = useState<string[]>([]);

//   // Loading state taaki user ko wait karne ka indication mile
//   const [isLoading, setIsLoading] = useState(false);

//   // Logout Feature
//   const logoutPage = async () => {
//     try {
//       const response = await axios.post('/api/logout');
//       if (response.status === 200) {
//         // Refresh ki jagah seedha login page par bhej dena better flow hai
//         router.push('/login');
//       }
//     } catch (err) {
//       alert("Logout Error: " + err);
//     }
//   }

//   // Generate Suggestion
//   const generateResponse = async () => {
//     setIsLoading(true); // API call se pehle loader on

//     try {
//       const response = await axios.post('/api/suggestmessages');

//       alert(response.data.message)
//       // Safety check: Agar backend se stringified array aa raha hai, toh use parse karlo
//       let messages = response.data.data;
//       if (typeof messages === 'string') {
//         messages = JSON.parse(messages);
//       }

//       setSuggestions(messages);
//     } catch (err) {
//       console.error("API Error:", err);
//       alert("Suggestions generate karne me problem hui!");
//     } finally {
//       setIsLoading(false); // API call khatam (chahe success ho ya fail)
//     }
//   }

//   return (
//     <div className="min-h-screen p-8 text-black">
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-10">
//         <h1 className="text-3xl font-bold text-white">Dashboard</h1>
//         <button
//           className="px-7 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-red-500 to-green-500 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:from-green-700 hover:to-orange-500 active:translate-y-0 shadow-lg"
//           onClick={logoutPage}
//         >
//           Logout
//         </button>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-2xl mx-auto space-y-8">
//         <button
//           className="w-full sm:w-auto px-7 py-3 text-white rounded-full font-semibold bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//           onClick={generateResponse}
//           disabled={isLoading} // Loading ke time button disable kardo
//         >
//           {isLoading ? 'Generating Magic... ✨' : 'Suggest Messages 🚀'}
//         </button>

//         {/* Suggestions List Render Karna */}
//         {suggestions.length > 0 && (
//           <div className="grid gap-4 mt-6">
//             {suggestions.map((msg, index) => (
//               <div
//                 key={index}
//                 className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-sm text-white font-medium hover:bg-white/20 transition-all cursor-pointer"
//               >
//                 {msg}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// };

// export default Dashboard;