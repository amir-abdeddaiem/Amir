"use client"

import React, { useState, useEffect, useRef } from "react"
import { Camera, Upload, Check, X, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Html5QrcodeScanner } from "html5-qrcode"

type MatchState = "idle" | "uploading" | "match-found" | "no-match"

interface FoundAnimal {
  color: string
  description: string
  breed: string
  gender: string
  type: string
  owner?: { name: string; contact: string }
}

export function AIPetMatcher() {
  const [matchState, setMatchState] = useState<MatchState>("idle")
  const [progress, setProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [animalData, setAnimalData] = useState<FoundAnimal | null>(null)
  const [reportData, setReportData] = useState<FoundAnimal>({
    color: "",
    description: "",
    breed: "",
    gender: "",
    type: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [scanQr, setScanQr] = useState(false)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const qrScannerContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scanQr && qrScannerContainerRef.current) {
      // Clear any previous scanner instance
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear QR scanner", error)
        })
      }

      // Initialize new scanner
      scannerRef.current = new Html5QrcodeScanner(
        "qr-scanner-container",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          supportedScanTypes: [],
          rememberLastUsedCamera: true
        },
        false
      )

      scannerRef.current.render(
        (decodedText) => {
          // Success callback
          handleQrScanSuccess(decodedText)
        },
        (errorMessage) => {
          // Error callback
          handleQrScanError(errorMessage)
        }
      )

      return () => {
        if (scannerRef.current) {
          scannerRef.current.clear().catch(error => {
            console.error("Failed to clear QR scanner on unmount", error)
          })
        }
      }
    }
  }, [scanQr])

  const handleQrScanSuccess = (decodedText: string) => {
    setScanQr(false)
    window.location.href = decodedText
  }

  const handleQrScanError = (errorMessage: string) => {
    console.error(errorMessage)
    // Don't show every error to the user, only show if scanning fails completely
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreviewUrl(reader.result as string)
      reader.readAsDataURL(file)
      checkAnimal(file)
    }
  }

  const checkAnimal = async (file: File) => {
    setMatchState("uploading")
    setProgress(0)
    setError(null)

    const formData = new FormData()
    formData.append("image", file)

    try {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch("/api/lostfound", {
        method: "POST",
        body: formData,
      })
      
      clearInterval(interval)
      setProgress(100)

      if (!response.ok) throw new Error("Failed to check for pet match")

      const data = await response.json()
      console.log(data)
      if (data.data.length>0) {
        setAnimalData(data.data)
        setMatchState("match-found")
      } else {
        setMatchState("no-match")
      }
    } catch (err) {
      setError("Error processing image. Try again.")
      setMatchState("idle")
    }
  }

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!selectedFile) {
      setError("No image selected")
      return
    }

    const formData = new FormData()
    formData.append("image", selectedFile)
    Object.entries(reportData).forEach(([key, value]) => formData.append(key, value))

    try {
      const response = await fetch("/api/foundanimal", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to report found pet")

      setDialogOpen(false)
      resetMatcher()
    } catch (err) {
      setError("Error reporting pet. Try again.")
    }
  }

  const handleInputChange = (field: keyof FoundAnimal, value: string) => {
    setReportData((prev) => ({ ...prev, [field]: value }))
  }

  const resetMatcher = () => {
    setMatchState("idle")
    setProgress(0)
    setSelectedFile(null)
    setPreviewUrl(null)
    setAnimalData(null)
    setReportData({ color: "", description: "", breed: "", gender: "", type: "" })
    setError(null)
    setDialogOpen(false)
    setScanQr(false)
  }

  return (
    <Card className="w-full max-w-md overflow-hidden shadow-md hover:shadow-lg hover:shadow-[#E29578]/10">
      <CardHeader className="bg-[#E29578]/10 pb-3">
        <CardTitle className="flex items-center gap-2 text-[#E29578]">
          <Camera className="h-5 w-5" />
          AI Pet Recognition
        </CardTitle>
        <CardDescription>
          Upload a pet photo to check for matches or report a found pet
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4">
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">{error}</div>
        )}

        {scanQr ? (
          <div className="space-y-4">
            <div 
              id="qr-scanner-container"
              ref={qrScannerContainerRef}
              className="w-full rounded-lg border"
            />
            <Button
              onClick={() => setScanQr(false)}
              className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300"
              variant="ghost"
            >
              Cancel Scan
            </Button>
          </div>
        ) : matchState === "idle" ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 bg-[#EDF6F9]/20 p-8 text-center">
            <div className="rounded-full bg-[#E29578]/20 p-3">
              <Upload className="h-6 w-6 text-[#E29578]" />
            </div>
            <div>
              <p className="font-medium">Upload a pet image</p>
              <p className="text-sm text-gray-500">Our AI will check for lost pet matches</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => document.getElementById("pet-image-upload")?.click()}
                className="bg-[#E29578] hover:bg-[#E29578]/90"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
              <Button
                variant="outline"
                className="border-[#E29578]/20 text-[#E29578] hover:bg-[#E29578]/10"
                onClick={() => setScanQr(true)}
              >
                <QrCode className="mr-2 h-4 w-4" />
                Scan QR
              </Button>
            </div>
            <input
              type="file"
              id="pet-image-upload"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <p className="text-xs text-gray-500">JPG, PNG, GIF (max 10MB)</p>
          </div>
        ) : matchState === "uploading" ? (
          <div className="space-y-4 py-6">
            {previewUrl && (
              <div className="mx-auto mb-4 h-40 w-40 overflow-hidden rounded-lg">
                <img src={previewUrl} alt="Pet preview" className="h-full w-full object-cover" />
              </div>
            )}
            <div className="text-center">
              <p className="font-medium">Processing image...</p>
              <p className="text-sm text-gray-500">Checking for matches</p>
            </div>
            <Progress value={progress} className="h-2 w-full" />
            <p className="text-center text-sm text-gray-500">{progress}% complete</p>
          </div>
        ) : matchState === "match-found" && animalData ? (
          <div className="space-y-4 py-6">
            <div className="flex items-start gap-4">
              {previewUrl && (
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                  <img src={previewUrl} alt="Pet preview" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <div className="rounded-full bg-[#83C5BE]/20 p-1">
                    <Check className="h-4 w-4 text-[#83C5BE]" />
                  </div>
                  <p className="font-medium text-[#83C5BE]">Match found!</p>
                </div>
                <p className="text-sm text-gray-500">This pet matches a lost pet report.</p>
              </div>
            </div>
            <div className="rounded-lg bg-[#EDF6F9]/30 p-4">
              <h4 className="mb-2 font-medium">Pet Details</h4>
              <div className="mb-4 space-y-1 text-sm">
                <p><span className="font-medium">Type:</span> {animalData.type}</p>
                <p><span className="font-medium">Breed:</span> {animalData.breed}</p>
                <p><span className="font-medium">Color:</span> {animalData.color}</p>
                <p><span className="font-medium">Gender:</span> {animalData.gender}</p>
                <p><span className="font-medium">Description:</span> {animalData.description}</p>
                {animalData.owner && (
                  <>
                    <p><span className="font-medium">Owner:</span> {animalData.owner.name}</p>
                    <p><span className="font-medium">Contact:</span> {animalData.owner.contact}</p>
                  </>
                )}
              </div>
              {animalData.owner && (
                <Button className="w-full bg-[#E29578] hover:bg-[#E29578]/90">
                  Contact Owner
                </Button>
              )}
            </div>
          </div>
        ) : matchState === "no-match" ? (
          <div className="space-y-4 py-6">
            <div className="flex items-start gap-4">
              {previewUrl && (
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                  <img src={previewUrl} alt="Pet preview" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <div className="rounded-full bg-red-500/20 p-1">
                    <X className="h-4 w-4 text-red-500" />
                  </div>
                  <p className="font-medium text-red-500">No match found</p>
                </div>
                <p className="text-sm text-gray-500">
                  No matching lost pet found. Report this pet to help reunite it with its owner.
                </p>
              </div>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-[#E29578] hover:bg-[#E29578]/90">
                  Report Found Pet
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Report Found Pet</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="type">Animal Type</Label>
                    <Select onValueChange={(value: string) => handleInputChange("type", value)} value={reportData.type}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dog">Dog</SelectItem>
                        <SelectItem value="cat">Cat</SelectItem>
                        <SelectItem value="bird">Bird</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="breed">Breed</Label>
                    <Input
                      id="breed"
                      value={reportData.breed}
                      onChange={(e) => handleInputChange("breed", e.target.value)}
                      placeholder="e.g., Golden Retriever"
                    />
                  </div>
                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      value={reportData.color}
                      onChange={(e) => handleInputChange("color", e.target.value)}
                      placeholder="e.g., Brown"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select onValueChange={(value: string) => handleInputChange("gender", value)} value={reportData.gender}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={reportData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe the pet (e.g., size, markings, behavior)"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#E29578] hover:bg-[#E29578]/90">
                    Submit Report
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        ) : null}
      </CardContent>

      <CardFooter
        className={cn(
          "flex items-center justify-between bg-[#EDF6F9]/20 px-4 py-3 text-xs text-gray-500",
          matchState !== "idle" && !scanQr && "justify-between",
        )}
      >
        <span>Powered by AICeternity™ Pet Recognition</span>
        {(matchState !== "idle" || scanQr) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetMatcher}
            className="h-7 px-2 text-xs text-[#E29578] hover:bg-[#E29578]/10"
          >
            Start Over
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}