

"use client"
import React, { useEffect } from "react";
import { useUserData } from "@/contexts/UserData";
import { useRouter } from "next/navigation";
 function page() {
  const { userData, refreshUserData } = useUserData()
  const Router = useRouter()

  useEffect(()=>{
    if(userData.accType != "provider"){
      Router.push("/")
    }
  })
  return <ServiceProviderProfile></ServiceProviderProfile>;
}

export default page;
