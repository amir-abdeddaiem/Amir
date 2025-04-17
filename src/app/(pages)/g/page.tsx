'use client';
import { signIn } from "next-auth/react";
import React from "react";
import { Button } from "@/components/ui/button";

function SigninWithGoogle() {
  return (
    <div>
      <Button
        onClick={() => signIn('credentials', { redirect: false })}
        variant="outline"
        size="default" // Add size
        className=""   // Optionally add custom styles or leave empty
      >
        899
      </Button>
    </div>
  );
}

export default SigninWithGoogle;
