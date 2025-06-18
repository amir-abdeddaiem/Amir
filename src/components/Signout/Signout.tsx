'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import { signOut } from 'next-auth/react';
import Cookies from 'js-cookie';
import { LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function Signout() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      // Show loading toast
      toast.info('Signing out...', {
        position: 'top-center',
        duration: 1500
      });
      
      // Add slight delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear cookies and sign out
      Cookies.remove("jwt");
      await signOut({ redirect: false });
      
      // Show success message
      toast.success('Signed out successfully', {
        position: 'top-center',
        duration: 2000
      });
      
      // Refresh the page to ensure clean state
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error('Failed to sign out', {
        position: 'top-center',
        description: 'Please try again',
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <Button
        onClick={handleSignOut}
        variant="destructive"
        size="md"
        className="relative overflow-hidden group px-6 shadow-md"
        disabled={isLoading}
      >
        <span className={`flex items-center transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          Sign Out
        </span>
          
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          </div>
        )}
        
        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
      </Button>
    </motion.div>
  );
}

export default Signout;