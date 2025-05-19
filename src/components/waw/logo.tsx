import { PawPrintIcon as Paw } from "lucide-react"
import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Paw className="h-6 w-6 text-[#FE3C72]" />
      <span className="font-bold text-xl hidden sm:inline-block">Paw-fect Match</span>
    </Link>
  )
}
