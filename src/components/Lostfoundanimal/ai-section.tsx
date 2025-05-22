"use client"

import { useState } from "react"
import { Camera, Upload, Search, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function AiSection() {
  const [stage, setStage] = useState<"idle" | "uploading" | "searching" | "found">("idle")
  const [progress, setProgress] = useState(0)

  const handleUpload = () => {
    setStage("uploading")
    setProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setStage("searching")

          // Simulate search and match
          setTimeout(() => {
            setStage("found")
          }, 2000)

          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/10 pb-3">
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          AI Pet Recognition
        </CardTitle>
        <CardDescription>Upload a photo to find matching pets</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        {stage === "idle" && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-muted-foreground/20 bg-muted/20 p-8 text-center">
            <div className="rounded-full bg-primary/20 p-3">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Drag and drop an image or click to browse</p>
            </div>
            <Button onClick={handleUpload} className={undefined} variant={undefined} size={undefined}>Upload Image</Button>
          </div>
        )}

        {stage === "uploading" && (
          <div className="space-y-4 py-6">
            <div className="text-center">
              <p className="font-medium">Uploading image...</p>
              <p className="text-sm text-muted-foreground">Please wait while we process your image</p>
            </div>
            <Progress value={progress} className="h-2 w-full" />
          </div>
        )}

        {stage === "searching" && (
          <div className="space-y-4 py-6">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="animate-pulse rounded-full bg-primary/20 p-3">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <p className="font-medium">Searching for matches...</p>
              <p className="text-sm text-muted-foreground">Our AI is comparing your image with lost and found pets</p>
            </div>
          </div>
        )}

        {stage === "found" && (
          <div className="space-y-4 py-6">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="rounded-full bg-accent/20 p-3">
                <Check className="h-6 w-6 text-accent" />
              </div>
              <p className="font-medium">✅ Match Found!</p>
              <p className="text-sm text-muted-foreground">We found a potential match for your pet</p>
              <Button className="mt-2" variant={undefined} size={undefined}>Give Access to Owner</Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
        Powered by AICeternity™ Pet Recognition
      </CardFooter>
    </Card>
  )
}
