"use client"

import { useState, useEffect, type FormEvent, type ChangeEvent, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Camera, MapPin, Phone, Mail, Calendar, User, Building, Award } from "lucide-react"
import { useUserData } from "@/contexts/UserData"
import axios from "axios"
import MapLocationPicker from "../ui/MapLocationPicker"

type Gender = "male" | "female" | "other"

interface ProfileData {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    birthDate?: string
    gender: Gender
    coordinates?: [number, number] | null;
    location: string
    bio: string
    avatar?: string
    accType: "regular" | "provider"
    businessName?: string
    businessType?: string
    services?: string[]
    certifications?: string
    website?: string
}
interface LocationData {
    coordinates: [number, number] | null;
    address: string;
}
export default function UpdateProfileImproved() {
    const router = useRouter()
    const { refreshUserData, userData } = useUserData()

    const [profileData, setProfileData] = useState<ProfileData>({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        birthDate: "",
        gender: "other",
        location: "",
        bio: "",
        accType: "regular",
    })

    const [locationData, setLocationData] = useState<LocationData>({
        coordinates: null,
        address: "",
    });

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

    useEffect(() => {
        if (userData && userData.id) {
            setProfileData(userData as ProfileData)
            setAvatarPreview(userData.avatar || null)
        }
    }, [userData])
    useEffect(() => {
        if (locationData.address) {
            setProfileData((prev) => ({
                ...prev,
                location: locationData.address,
                coordinates: locationData.coordinates,
            }));
        }
    }, [locationData]);
    const handleChange = useCallback(<K extends keyof ProfileData>(field: K, value: ProfileData[K]) => {
        setProfileData((prev) => ({ ...prev, [field]: value }))
    }, [])

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)

        try {
            setIsLoading(true)

            if (!profileData.firstName || !profileData.lastName || !profileData.email) {
                throw new Error("Please fill in all required fields")
            }

            const response = await axios.put("/api/profile", {
                ...profileData,
                avatar: avatarPreview,
            })

            if (response.data.error) throw new Error(response.data.error)

            setSuccess(true)
            await refreshUserData()

            setTimeout(() => {
                router.push("/user")
            }, 2000)
        } catch (err: any) {
            setError(err.message || "Failed to update profile")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Card className="shadow-2xl border-0 overflow-hidden">
                        {/* Header with gradient */}
                        <div className="bg-[#83C5BE] p-6 text-white">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                                        <AvatarImage src={avatarPreview || profileData.avatar} className={undefined} />
                                        <AvatarFallback className="bg-white text-emerald-600 text-xl font-bold">
                                            {profileData.firstName.charAt(0)}
                                            {profileData.lastName.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <label
                                        htmlFor="avatar-upload"
                                        className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                    >
                                        <Camera className="w-4 h-4 text-emerald-600" />
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold">Update Profile</h1>
                                    <p className="text-emerald-100">Keep your information up to date</p>
                                    {profileData.accType === "provider" && (
                                        <Badge className="mt-2 bg-white text-emerald-600" variant={undefined}>Service Provider</Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <CardContent className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Personal Information */}
                                <motion.section
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="flex items-center space-x-2 mb-6">
                                        <User className="w-5 h-5 text-emerald-600" />
                                        <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                                                First Name <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="firstName"
                                                value={profileData.firstName}
                                                onChange={(e: { target: { value: string } }) => handleChange("firstName", e.target.value)}
                                                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                                required type={undefined} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                                                Last Name <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="lastName"
                                                value={profileData.lastName}
                                                onChange={(e: { target: { value: string } }) => handleChange("lastName", e.target.value)}
                                                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                                required type={undefined} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                                                <Mail className="w-4 h-4 mr-1" />
                                                Email <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e: { target: { value: string } }) => handleChange("email", e.target.value)}
                                                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center">
                                                <Phone className="w-4 h-4 mr-1" />
                                                Phone
                                            </Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={profileData.phone}
                                                onChange={(e: { target: { value: string } }) => handleChange("phone", e.target.value)}
                                                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                            />
                                        </div>


                                        <div className="w-full">
                                            <Label htmlFor="birthDate" className="text-sm font-medium text-gray-700 flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                Birth Day
                                            </Label>
                                            <Input
                                                id="birthDate"
                                                type="date"
                                                value={profileData?.birthDate ? new Date(profileData.birthDate).toISOString().split("T")[0] : ""}
                                                onChange={(e: any) => handleChange("birthDate", e.target.value)}
                                                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                            />
                                        </div>

                                        <div className="w-full">
                                            <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                                                Gender
                                            </Label>
                                            <Select
                                                value={profileData.gender}
                                               
                                            >
                                                <SelectTrigger className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                                <SelectContent className={undefined}>
                                                    <SelectItem value="male" className={undefined}>Male</SelectItem>
                                                    <SelectItem value="female" className={undefined} >Female</SelectItem>
                                                    <SelectItem value="other" className={undefined}>Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>


                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-lg font-semibold" htmlFor="location">Location</Label>
                                        <div className="border rounded-lg p-2 h-103">
                                            <MapLocationPicker
                                                onLocationSelect={setLocationData}
                                                initialPosition={profileData.coordinates || [36.8065, 10.1815]}


                                            />



                                        </div>

                                    </div>
                                    <div className="space-y-2 mt-6">
                                        <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                                            About You
                                        </Label>
                                        <Textarea
                                            id="bio"
                                            value={profileData.bio}
                                            onChange={(e: { target: { value: string } }) => handleChange("bio", e.target.value)}
                                            className="min-h-[120px] border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                            placeholder="Tell us about yourself..."
                                        />
                                    </div>

                                </motion.section>

                                {/* Business Information (for providers) */}
                                {profileData.accType === "provider" && (
                                    <>
                                        <Separator className={undefined} />
                                        <motion.section
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <div className="flex items-center space-x-2 mb-6">
                                                <Building className="w-5 h-5 text-blue-600" />
                                                <h2 className="text-xl font-semibold text-gray-800">Business Information</h2>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="businessName" className="text-sm font-medium text-gray-700">
                                                        Business Name
                                                    </Label>
                                                    <Input
                                                        id="businessName"
                                                        value={profileData.businessName || ""}
                                                        onChange={(e: { target: { value: string | undefined } }) => handleChange("businessName", e.target.value)}
                                                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" type={undefined} />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="businessType" className="text-sm font-medium text-gray-700">
                                                        Business Type
                                                    </Label>
                                                    <Select
                                                        value={profileData.businessType || ""}
                                                        onValueChange={(value: string | undefined) => handleChange("businessType", value)}
                                                    >
                                                        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                                            <SelectValue placeholder="Select business type" />
                                                        </SelectTrigger>
                                                        <SelectContent className={undefined}>
                                                            <SelectItem value="veterinary" className={undefined}>Veterinary Clinic</SelectItem>
                                                            <SelectItem value="training" className={undefined} >Pet Training</SelectItem>
                                                            <SelectItem value="grooming" className={undefined} >Pet Grooming</SelectItem>
                                                            <SelectItem value="boarding" className={undefined} >Pet Boarding</SelectItem>
                                                            <SelectItem value="retail" className={undefined} >Pet Retail</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="space-y-2 mt-6">
                                                <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                                                    Website
                                                </Label>
                                                <Input
                                                    id="website"
                                                    type="url"
                                                    value={profileData.website || ""}
                                                    onChange={(e: { target: { value: string | undefined } }) => handleChange("website", e.target.value)}
                                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                    placeholder="https://your-website.com"
                                                />
                                            </div>

                                            <div className="space-y-2 mt-6">
                                                <Label htmlFor="certifications" className="text-sm font-medium text-gray-700 flex items-center">
                                                    <Award className="w-4 h-4 mr-1" />
                                                    Certifications
                                                </Label>
                                                <Textarea
                                                    id="certifications"
                                                    value={profileData.certifications || ""}
                                                    onChange={(e: { target: { value: string | undefined } }) => handleChange("certifications", e.target.value)}
                                                    className="min-h-[100px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                    placeholder="List your professional certifications..."
                                                />
                                            </div>
                                        </motion.section>
                                    </>
                                )}

                                {/* Error and Success Messages */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                {success && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg"
                                    >
                                        Profile updated successfully! Redirecting to dashboard...
                                    </motion.div>
                                )}

                                {/* Action Buttons */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="flex gap-4 pt-6 justify-center"
                                >
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="lg"
                                        onClick={() => router.back()}
                                        disabled={isLoading}
                                        className="px-8"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={isLoading}
                                        className="px-8 bg-[#83C5BE]" variant={undefined}                  >
                                        {isLoading ? "Saving..." : "Save Changes"}
                                    </Button>
                                </motion.div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
