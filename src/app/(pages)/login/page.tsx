"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Mail, Lock, Phone } from "lucide-react";
import Link from "next/link";
import SigninWithGoogle from "@/components/SigninWithGoogle/SigninWithGoogle";
import SigninWithFcb from "@/components/SigninWithFcb/SigninWithFcb";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback(
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    },
    []
  );

  const handleCheckboxChange = useCallback((checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      rememberMe: checked,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      setIsLoading(true);

      try {
        const { email, password } = formData;
        const response = await axios.post("/api/auth/login", { email, password });
        const { token } = response.data;

        if (token) {
          Cookies.set("token", token, {
            expires: formData.rememberMe ? 7 : 1 / 24,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
          router.push("/user");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Login failed. Please check your credentials.");
      } finally {
        setIsLoading(false);
      }
    },
    [formData, router]
  );

  const AuthIcon = ({ icon: Icon }: { icon: any }) => (
    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="bg-[#E29578] text-white p-6 text-center">
          <h1 className="text-2xl font-semibold">Welcome Back!</h1>
          <p className="text-white/80 mt-1 text-sm">Sign in to your Animal's Club account</p>
        </div>

        <Tabs defaultValue="email" className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100 p-1 rounded-md">
              <TabsTrigger
                value="email"
                className="text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#E29578] rounded-sm"
              >
                Email
              </TabsTrigger>
              <TabsTrigger
                value="phone"
                className="text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#E29578] rounded-sm"
              >
                Phone
              </TabsTrigger>
            </TabsList>
          </div>

          {error && (
            <div className="px-6 text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <TabsContent value="email" className="px-6 pb-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label  >Email</label>
                  <div className="relative flex items-center">
                    <AuthIcon icon={Mail} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange("email")}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Label className={""} >Password</Label>
                    <Link href="/forgot-password" className="text-xs text-[#E29578] hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative flex items-center">
                    <AuthIcon icon={Lock} />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange("password")}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                  className={""}
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                    Remember me
                  </Label>
                </div>

                <Button type="submit" className="w-full bg-[#E29578]" variant={"outline"} size={""} disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="phone" className="px-6 pb-6">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label  className={""}>Phone Number</Label>
                  <div className="relative flex items-center">
                    <AuthIcon icon={Phone} />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button size={""} variant={"outline"} className="w-full bg-[#E29578]" disabled={isLoading}>
                  {isLoading ? "Sending code..." : "Send Verification Code"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>

        <div className="border-t border-gray-200 px-6 py-6 bg-gray-50 text-center text-sm text-gray-600">
          <p>
            Don't have an account?{" "}
            <Link href="/register" className="text-[#E29578] hover:underline font-medium">
              Sign up
            </Link>
          </p>

          <div className="flex items-center my-4">
            <div className="h-px flex-1 bg-gray-300" />
            <span className="px-3 text-xs text-gray-400 uppercase">Or sign in with</span>
            <div className="h-px flex-1 bg-gray-300" />
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-2">
            <SigninWithGoogle />
            <SigninWithFcb  />
          </div>
        </div>
      </div>
    </div>
  );
}
