// src/components/ui/sidebar-admin.jsx
"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Calendar,
  Home,
  MessageSquare,
  PawPrint,
  Search,
  Settings,
  ShoppingBag,
  Users,
  BarChart3,
  Moon,
  Sun,
} from "lucide-react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AppSidebar({ open, setOpen }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <Home className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />,
    },
    {
      label: "Statistics",
      href: "/dashboard/statistics",
      icon: (
        <BarChart3 className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
      ),
    },
    {
      label: "Users",
      href: "/dashboard/users",
      icon: (
        <Users className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
      ),
    },
    {
      label: "Animals",
      href: "/dashboard/animals",
      icon: (
        <PawPrint className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
      ),
    },
    {
      label: "Appointments",
      href: "/dashboard/appointments",
      icon: (
        <Calendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
      ),
    },
    {
      label: "Marketplace",
      href: "/dashboard/marketplace",
      icon: (
        <ShoppingBag className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
      ),
    },
    {
      label: "Lost & Found",
      href: "/dashboard/lost-found",
      icon: (
        <Search className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
      ),
    },
    {
      label: "Feedback",
      href: "/dashboard/feedback",
      icon: (
        <MessageSquare className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
      ),
    },
  ];

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-20">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-10">
            {links.map((link, idx) => (
              <SidebarLink
                key={idx}
                link={{
                  ...link,
                  isActive: pathname === link.href,
                }}
              />
            ))}
          </div>
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

export const Logo = () => (
  <Link
    href="/dashboard"
    className="font-normal flex space-x-2 items-center text-sm text-[#006D77] py-1 relative z-20"
  >
    <div className="h-5 w-6 bg-[#006D77] rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium text-[#006D77] whitespace-pre"
    >
      Animal Platform
    </motion.span>
  </Link>
);

export const LogoIcon = () => (
  <Link
    href="/dashboard"
    className="font-normal flex space-x-2 items-center text-sm text-[#006D77] py-1 relative z-20"
  >
    <div className="h-5 w-6 bg-[#006D77] rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
  </Link>
);
