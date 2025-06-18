"use client"
import UserProfile from "@/components/Profile/p";
import React, { useEffect } from "react";
import { useUserData } from "@/contexts/UserData";
function page() {
  const {refreshUserData} = useUserData()
  useEffect(()=>{
    refreshUserData()
  },[])
  return (
    <div>
      <UserProfile />
    </div>
  );
}

export default page;
