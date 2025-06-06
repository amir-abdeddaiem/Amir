"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Mail, Lock, Phone } from "lucide-react";
import Link from "next/link";
import SigninWithGoogle from "@/components/SigninWithGoogle/SigninWithGoogle";
import SigninWithFcb from "@/components/SigninWithFcb/SigninWithFcb";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Signin({ isOpen, onClose }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback((field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  }, []);

  const handleCheckboxChange = useCallback((checked) => {
    setFormData(prev => ({
      ...prev,
      rememberMe: checked
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { email, password } = formData;
      const response = await axios.post("/api/auth/login", { email, password });
      const { token } = response.data;

      if (token) {
        Cookies.set("jwt", token, {
          expires: formData.rememberMe ? 7 : 1 / 24,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict"
        });
        router.push("/Profile");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  }, [formData, router]);

  const handleExternalClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const AuthIcon = ({ icon: Icon }) => (
    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="text-[#E29578] p-0 h-auto hover:underline text-sm sm:text-base"
          aria-label="Sign in"
        >
          Sign in
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-full mx-auto p-0 overflow-hidden border-none shadow-2xl rounded-lg">
        <DialogHeader className="bg-[#E29578] text-white p-4 sm:p-6 pt-6 sm:pt-8 relative">
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-center">
            Welcome Back!
          </DialogTitle>
          <DialogDescription className="text-white/80 text-center mt-1 text-sm sm:text-base">
            Sign in to your Animal's Club account
          </DialogDescription>
          <DialogClose className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white rounded-full p-1">
          </DialogClose>
        </DialogHeader>

        <Tabs defaultValue="email" className="w-full">
          <div className="px-4 sm:px-6 pt-2 sm:pt-4">
            <TabsList className="grid w-full grid-cols-2 mb-2 sm:mb-4 bg-gray-100 p-1 rounded-md">
              <TabsTrigger
                value="email"
                className="text-sm sm:text-base data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#E29578] rounded-sm"
              >
                Email
              </TabsTrigger>
              <TabsTrigger
                value="phone"
                className="text-sm sm:text-base data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#E29578] rounded-sm"
              >
                Phone
              </TabsTrigger>
            </TabsList>
          </div>

          {error && (
            <div className="px-4 sm:px-6 text-red-500 text-xs sm:text-sm text-center">
              {error}
            </div>
          )}

          <TabsContent value="email" className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0 sm:pt-2">
            <form onSubmit={handleSubmit}>
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="email-signin">Email</Label>
                  <div className="relative flex items-center">
                    <AuthIcon icon={Mail} />
                    <Input
                      id="email-signin"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange('email')}
                      required
                      className="pl-10 text-sm sm:text-base"
                      autoComplete="email"
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
                      aria-label="Forgot password"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative flex items-center">
                    <AuthIcon icon={Lock} />
                    <Input
                      id="password-signin"
                      type="password"
                      value={formData.password}
                      onChange={handleChange('password')}
                      required
                      className="pl-10 text-sm sm:text-base"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 sm:pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember-signin"
                      checked={formData.rememberMe}
                      onCheckedChange={handleCheckboxChange}
                      aria-label="Remember me"
                    />
                    <Label
                      htmlFor="remember-signin"
                      className="text-xs sm:text-sm font-normal text-gray-600 cursor-pointer"
                    >
                      Remember me
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#E29578] hover:bg-[#d88a6d] h-10 text-sm sm:text-base mt-2 sm:mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="phone" className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0 sm:pt-2">
            <form onSubmit={handleSubmit}>
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="phone-signin">Phone Number</Label>
                  <div className="relative flex items-center">
                    <AuthIcon icon={Phone} />
                    <Input
                      id="phone-signin"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      required
                      className="pl-10 text-sm sm:text-base"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#E29578] hover:bg-[#d88a6d] h-10 text-sm sm:text-base mt-2 sm:mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending code..." : "Send Verification Code"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>

        <DialogFooter className="grid grid-cols-1 items-center gap-3 sm:gap-4 px-4 sm:px-6 pb-4 sm:pb-6 pt-2 sm:pt-4 bg-gray-50 border-t border-gray-200">
          <div className="text-center text-xs sm:text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-[#E29578] hover:underline"
              onClick={handleExternalClose}
              aria-label="Sign up"
            >
              Sign up
            </Link>
          </div>

          <div className="flex items-center w-full text-center">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="px-3 sm:px-4 text-gray-400 text-xs font-medium uppercase whitespace-nowrap">
              Or sign in with
            </span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 w-full text-center">
            <SigninWithGoogle className="w-full sm:w-auto" />
            <SigninWithFcb className="w-full sm:w-auto" />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}