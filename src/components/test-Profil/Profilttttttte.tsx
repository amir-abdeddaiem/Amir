'use client'

import { useSession } from "next-auth/react"
import SigninWithGoogle from "../SigninWithGoogle/SigninWithGoogle";
import Image from "next/image";
import SigninWithFcb from "../SigninWithFcb/SigninWithFcb";

function Profile() {
    const {data , status } = useSession();
  return (
    <div>
      {status === "loading" && <p>Loading...</p>}
      {status === "unauthenticated" && (<SigninWithFcb/>)&& (<SigninWithGoogle/>)}
      {status === "authenticated"&&(
        <>
            <h1> {data.user?.name}</h1>
            <Image
               src={data.user?.image as string}
                alt="profile"
                 width={100} 
                 height={100}/>
                <p>{data.user?.email}</p>
            
        </>
      )}
    </div>
  )
}

export default Profile
