'use client';
import { signIn } from "next-auth/react";
import React from "react";
import { Button } from "@/components/ui/button";


function SigninWithFcb() {
  return (
    <div>
        <Button
        onClick={() => signIn('facebook')}
        variant="outline"
        size="" // Add size
        className="w-full"  >
        <svg
          className="w-5 h-5 mr-2"
          fill="#1877F2"
          viewBox="0 0 24 24"
        >
          <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
        </svg>
        Facebook
      </Button>
     

    </div>
  );
}

export default SigninWithFcb;
