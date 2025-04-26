"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Mail, Lock, Phone } from "lucide-react";
import Link from "next/link";
import SigninWithGoogle from "@/components/SigninWithGoogle/SigninWithGoogle";
import SigninWithFcb from "@/components/SigninWithFcb/SigninWithFcb";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function Signin({ isOpen, onClose }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const response = await axios.post('/api/login', { email, password });
      const { token } = response.data;
      if (token) {
        Cookies.set('token', token, { expires: 1/24 }); // 1 hour
        console.log('Token stored in cookie');
        router.push('/userDashboard'); // Redirect to user dashboard
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleExternalClose = () => {
    if (onClose) {
      onClose();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-[#E29578] p-0 h-auto hover:underline">
          Sign in
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-lg">
        <DialogHeader className="bg-[#E29578] text-white p-6 pt-8 relative">
          <DialogTitle className="text-2xl font-semibold text-center">Welcome Back!</DialogTitle>
          <DialogDescription className="text-white/80 text-center mt-1">
            Sign in to your Animal's Club account
          </DialogDescription>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleExternalClose}
              className="absolute top-3 right-3 text-white/70 hover:text-white hover:bg-white/20 rounded-full w-8 h-8"
            >
              <X size={20} />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </DialogHeader>

        <Tabs defaultValue="email" className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100 p-1 rounded-md">
              <TabsTrigger
                value="email"
                className="text-base data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#E29578] rounded-sm"
              >
                Email
              </TabsTrigger>
              <TabsTrigger
                value="phone"
                className="text-base data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#E29578] rounded-sm"
              >
                Phone
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="email" className="px-6 pb-6 pt-2">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="email-signin">Email</Label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email-signin"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password-signin">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-[#E29578] hover:underline"
                      onClick={handleExternalClose}
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password-signin"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember-signin"
                      checked={rememberMe}
                      onCheckedChange={setRememberMe}
                      aria-label="Remember me"
                    />
                    <Label htmlFor="remember-signin" className="text-sm font-normal text-gray-600 cursor-pointer">
                      Remember me
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#E29578] hover:bg-[#d88a6d] h-10 text-base mt-4"
                >
                  Sign In
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="phone" className="px-6 pb-6 pt-2">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="phone-signin">Phone Number</Label>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone-signin"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#E29578] hover:bg-[#d88a6d] h-10 text-base mt-4"
                >
                  Send Verification Code
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col space-y-4 px-6 pb-6 pt-4 bg-gray-50 border-t border-gray-200">
          <div className="text-center text-sm text-gray-600 w-full">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-[#E29578] hover:underline"
              onClick={handleExternalClose}
            >
              Sign up
            </Link>
          </div>

          <div className="flex items-center justify-center w-full py-2">
            <div className="h-px bg-gray-200 flex-grow"></div>
            <span className="px-4 text-gray-400 text-xs font-medium uppercase">Or sign in with</span>
            <div className="h-px bg-gray-200 flex-grow"></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <SigninWithGoogle />
            <SigninWithFcb />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
