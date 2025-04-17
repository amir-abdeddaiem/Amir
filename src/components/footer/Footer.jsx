"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <footer className="bg-[#83C5BE] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-4 text-lg font-bold">About Animal's Club</h3>
            <p className="mb-4 text-sm">
              Animal's Club is a digital platform connecting pet owners with
              specialized centers and services, creating a community for all
              animal lovers.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-[#E29578] transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-[#E29578] transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-[#E29578] transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-[#E29578] transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="hover:text-[#E29578] transition-colors"
                >
                  Marketplace
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-[#E29578] transition-colors"
                >
                  Lost & Found Animals
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-[#E29578] transition-colors"
                >
                  Community Discussion
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-[#E29578] transition-colors"
                >
                  Chatbot
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-[#E29578] transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 shrink-0" />
                <span>123 Pet Street, Animal City, AC 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 shrink-0" />
                <span>info@animalsclub.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Newsletter</h3>
            <p className="mb-4 text-sm">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form className="space-y-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-white/10 border-white/20 placeholder:text-white/50 text-white"
              />
              <Button className="w-full bg-[#E29578] text-white hover:bg-[#E29578]/90">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-white/20 pt-6 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Animal's Club. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
