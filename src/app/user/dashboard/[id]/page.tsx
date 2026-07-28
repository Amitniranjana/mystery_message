"use client"
import React, { use } from 'react'

function Profile({params}:{params:Promise<{id:string}>}) {
    const {id}=use(params)
  return (
<div>{id}</div>
  )
}

export default Profile