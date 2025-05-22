"use client"

import type React from "react"

import { useState } from "react"
import { Camera, Upload, Search, Check, X, QrCode, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type MatchState = "idle" | "uploading" | "searching" | "match-found" | "no-match"

export function AIPetMatcher() {
  const [matchState, setMatchState] = useState<MatchState>("idle")
  const [progress, setProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
      simulateUpload()
    }
  }

  const simulateUpload = () => {
    setMatchState("uploading")
    setProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          simulateSearch()
          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  const simulateSearch = () => {
    setMatchState("searching")

    // Simulate AI search process
    setTimeout(() => {
      // Randomly determine if a match is found (70% chance for demo purposes)
      const isMatchFound = Math.random() < 0.7
      setMatchState(isMatchFound ? "match-found" : "no-match")
    }, 2500)
  }

  const resetMatcher = () => {
    setMatchState("idle")
    setProgress(0)
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  return (
    <Card className="w-full max-w-md overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-[#E29578]/10">
      <CardHeader className="bg-[#E29578]/10 pb-3">
        <CardTitle className="flex items-center gap-2 text-[#E29578]">
          <Camera className="h-5 w-5" />
          AI Pet Recognition
        </CardTitle>
        <CardDescription>
          Upload a photo of a found pet to see if it matches with any reported lost pets
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4">
        {matchState === "idle" && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 bg-[#EDF6F9]/20 p-8 text-center">
            <div className="rounded-full bg-[#E29578]/20 p-3">
              <Upload className="h-6 w-6 text-[#E29578]" />
            </div>
            <div>
              <p className="font-medium">Upload an image of the pet you found</p>
              <p className="text-sm text-gray-500">Our AI will compare it with lost pet reports in the system</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => document.getElementById("pet-image-upload")?.click()}
                className="bg-[#E29578] hover:bg-[#E29578]/90 transition-colors duration-200" variant={undefined} size={undefined}              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
              <Button
                variant="outline"
                className="border-[#E29578]/20 text-[#E29578] hover:bg-[#E29578]/10 transition-colors duration-200" size={undefined}              >
                <QrCode className="mr-2 h-4 w-4" />
                Scan QR
              </Button>
            </div>
            <input type="file" id="pet-image-upload" accept="image/*" className="hidden" onChange={handleFileChange} />
            <p className="text-xs text-gray-500">Supported formats: JPG, PNG, GIF (max 10MB)</p>
          </div>
        )}

        {matchState === "uploading" && (
          <div className="space-y-4 py-6">
            {previewUrl && (
              <div className="mx-auto mb-4 h-40 w-40 overflow-hidden rounded-lg">
                <img src={previewUrl || "/placeholder.svg"} alt="Pet preview" className="h-full w-full object-cover" />
              </div>
            )}
            <div className="text-center">
              <p className="font-medium">Uploading image...</p>
              <p className="text-sm text-gray-500">Please wait while we process your image</p>
            </div>
            <Progress value={progress} className="h-2 w-full" />
            <p className="text-center text-sm text-gray-500">{progress}% complete</p>
          </div>
        )}

        {matchState === "searching" && (
          <div className="space-y-4 py-6">
            {previewUrl && (
              <div className="mx-auto mb-4 h-40 w-40 overflow-hidden rounded-lg">
                <img src={previewUrl || "/placeholder.svg"} alt="Pet preview" className="h-full w-full object-cover" />
              </div>
            )}
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="animate-pulse rounded-full bg-[#E29578]/20 p-3">
                <Search className="h-6 w-6 text-[#E29578]" />
              </div>
              <p className="font-medium">Searching for matches...</p>
              <p className="text-sm text-gray-500">Our AI is comparing your image with lost pet reports</p>
            </div>
          </div>
        )}

        {matchState === "match-found" && (
          <div className="space-y-4 py-6">
            <div className="flex items-start gap-4">
              {previewUrl && (
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Pet preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <div className="rounded-full bg-[#83C5BE]/20 p-1">
                    <Check className="h-4 w-4 text-[#83C5BE]" />
                  </div>
                  <p className="font-medium text-[#83C5BE]">Match found!</p>
                </div>
                <p className="text-sm text-gray-500">
                  This pet belongs to a registered user in our system. You can help reunite them!
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-[#EDF6F9]/30 p-4">
              <h4 className="mb-2 font-medium">Pet Details</h4>
              <div className="mb-4 space-y-1 text-sm">
                <p>
                  <span className="font-medium">Name:</span> Max
                </p>
                <p>
                  <span className="font-medium">Breed:</span> Golden Retriever
                </p>
                <p>
                  <span className="font-medium">Missing since:</span> May 18, 2025
                </p>
              </div>
              <Button className="w-full bg-[#E29578] hover:bg-[#E29578]/90" variant={undefined} size={undefined}>
                Give Access to Owner
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {matchState === "no-match" && (
          <div className="space-y-4 py-6">
            <div className="flex items-start gap-4">
              {previewUrl && (
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Pet preview"
                    className="h-full w-full object-cover"
                  />
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
                  We couldn't find a matching pet in our system. You can create a new "Found Pet" report.
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-[#EDF6F9]/30 p-4">
              <h4 className="mb-2 font-medium">What would you like to do?</h4>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button className="flex-1 bg-[#E29578] hover:bg-[#E29578]/90" variant={undefined} size={undefined}>Report Found Pet</Button>
                <Button variant="outline" className="flex-1 border-[#E29578]/20 text-[#E29578] hover:bg-[#E29578]/10" size={undefined}>
                  Try Another Image
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter
        className={cn(
          "flex items-center justify-between bg-[#EDF6F9]/20 px-4 py-3 text-xs text-gray-500",
          matchState !== "idle" && matchState !== "uploading" && "justify-between",
        )}
      >
        <span>Powered by AICeternity™ Pet Recognition</span>
        {matchState !== "idle" && matchState !== "uploading" && (
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
