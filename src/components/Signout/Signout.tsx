'use client'
import React from 'react'
import { Button } from "@/components/ui/button";
import { signOut } from 'next-auth/react';
function Signout() {
  return (
    <div>
      <Button onClick={() => signOut()}>
      sign Out
    </Button>
    </div>
  )
}

export default Signout
