"use client"

import type React from "react"

import { useState } from "react"
import { Camera, Upload, MapPin } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { DatePicker } from "@/components/ui/date-picker"
import { toast } from "sonner"

interface ReportFoundDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReportFoundDialog({ open, onOpenChange }: ReportFoundDialogProps) {
  const [date, setDate] = useState<Date>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Report submitted successfully!", {
      description: "Thank you for helping reunite a pet with their owner.",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-auto sm:rounded-xl">
        <DialogHeader className={undefined}>
          <DialogTitle className={undefined}>Report a Found Pet</DialogTitle>
          <DialogDescription className={undefined}>
            Fill out the form below to report a pet you've found. This will help reunite them with their owner.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pet-image" className={undefined}>Pet Image</Label>
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-muted-foreground/20 bg-muted/20 p-6 text-center">
              <div className="rounded-full bg-primary/20 p-3">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Drag and drop an image or click to browse</p>
                <p className="text-xs text-muted-foreground">Clear photos help identify the pet faster</p>
              </div>
              <Button type="button" variant="outline" size="sm" className={undefined}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pet-type" className={undefined}>Pet Type</Label>
              <Select>
                <SelectTrigger id="pet-type" className={undefined}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className={undefined} >
                  <SelectItem value="dog" className={undefined} >Dog</SelectItem>
                  <SelectItem value="cat" className={undefined} >Cat</SelectItem>
                  <SelectItem value="bird" className={undefined} >Bird</SelectItem>
                  <SelectItem value="other" className={undefined} >Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="breed" className={undefined}>Breed (if known)</Label>
              <Input id="breed" placeholder="e.g., Labrador, Siamese" className={undefined} type={undefined} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location" className={undefined}>Location Found</Label>
              <div className="relative">
                <MapPin className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="location" placeholder="Address or area" className="pl-8" type={undefined} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-found" className={undefined}>Date Found</Label>
              <div className="relative">
                {/* <DatePicker date={date} onSelect={setDate} /> */}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className={undefined}>Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the pet, including color, size, distinctive features, collar, etc."
              rows={4} className={undefined}            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className={undefined}>Your Name</Label>
              <Input id="name" placeholder="Full name" className={undefined} type={undefined} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact" className={undefined}>Contact Number</Label>
              <Input id="contact" placeholder="Phone number" className={undefined} type={undefined} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className={undefined}>Email Address</Label>
            <Input id="email" type="email" placeholder="Your email address" className={undefined} />
          </div>

          <DialogFooter className={undefined}>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className={undefined} size={undefined}>
              Cancel
            </Button>
            <Button type="submit" className={undefined} variant={undefined} size={undefined}>Submit Report</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
