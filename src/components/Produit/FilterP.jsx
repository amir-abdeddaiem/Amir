"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconSearch,
  IconFilter,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Produit } from "./Produit";

import { useRouter } from "next/navigation";

export function FilterP() {
  const router = useRouter();
  const goToProfile = () => {
    router.push("/user/[id]"); // Naviguer vers la page /about
  };
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "../../../user/[id]",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const products = [
    {
      title: "Hamster",
      description:
        "Hamsters are fun animals and can make good first pets, provided you understand what they need to be healthy and happy.",
      image: "/hams.jpg",
    },
    {
      title: "Cat",
      description:
        "Cats are independent and affectionate animals that make great companions.",
      image: "/cat.jpg",
    },
    {
      title: "Dog",
      description:
        "Dogs are loyal and friendly pets that bring joy to any household.",
      image: "/dog.jpg",
    },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || product.title === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-[#EDF6F9] w-full flex-1 max-w-7*1 mx-auto border border-neutral-200 overflow-hidden",
        "h-screen"
      )}
    >
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <Image
                    src="/hamspng"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Search Bar and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#83C5BE] focus:outline-none focus:ring-2 focus:ring-[#006D77]"
            />
            <IconSearch className="absolute left-3 top-2.5 text-[#006D77] h-5 w-5" />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-[#83C5BE] focus:outline-none focus:ring-2 focus:ring-[#006D77]"
          >
            <option value="all">All</option>
            <option value="Hamster">Hamster</option>
            <option value="Cat">Cat</option>
            <option value="Dog">Dog</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <Produit key={index} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Logo Components
export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-[#006D77] py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-[#006D77] rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-[#006D77] whitespace-pre"
      >
        Acet Labs
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-[#006D77] py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-[#006D77] rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
