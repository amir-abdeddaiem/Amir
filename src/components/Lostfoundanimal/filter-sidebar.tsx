// "use client"

// import { useState } from "react"
// import { Filter, Dog, Cat, Bird, Rabbit, Search, AlertTriangle, Heart } from "lucide-react"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarInput,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"
// import { Label } from "@/components/ui/label"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Slider } from "@/components/ui/slider"
// import { Button } from "@/components/ui/button"
// // import { DatePicker } from "@/components/ui/date-picker"

// export function FilterSidebar() {
//   const [date, setDate] = useState<Date>()

//   const [filters, setFilters] = useState({
//     status: {
//       lost: true,
//       found: true,
//     },
//     petType: "all",
//     dateFrom: null,
//     dateTo: null,
//     distance: 5,
//   })

//   const handleStatusChange = (status: string, checked: any) => {
//     setFilters((prev) => ({
//       ...prev,
//       status: {
//         ...prev.status,
//         [status]: checked,
//       },
//     }))
//   }

//   const handlePetTypeChange = (type: string) => {
//     setFilters((prev) => ({
//       ...prev,
//       petType: type,
//     }))
//   }

//   const handleDistanceChange = (value: any[]) => {
//     setFilters((prev) => ({
//       ...prev,
//       distance: value[0],
//     }))
//   }

//   return (
//     <Sidebar variant="floating" collapsible="icon" className={undefined}>
//       <SidebarHeader className={undefined}>
//         <div className="flex items-center gap-2 px-2 py-3">
//           <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#E29578] text-white">
//             <Filter className="h-4 w-4" />
//           </div>
//           <div className="font-semibold">Filter Pets</div>
//         </div>
//         <div className="relative px-2 pb-2">
//           <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
//           <SidebarInput placeholder="Search pets..." className="pl-8" />
//         </div>
//       </SidebarHeader>

//       <SidebarContent className={undefined}>
//         <SidebarGroup className={undefined}>
//           <SidebarGroupLabel className={undefined}>Pet Status</SidebarGroupLabel>
//           <SidebarGroupContent className={undefined}>
//             <div className="space-y-2">
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="lost"
//                   checked={filters.status.lost}
//                   onCheckedChange={(checked: any) => handleStatusChange("lost", checked)} className={undefined}                />
//                 <Label htmlFor="lost" className="flex items-center gap-1.5">
//                   <AlertTriangle className="h-4 w-4 text-red-500" />
//                   Lost Pets
//                 </Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="found"
//                   checked={filters.status.found}
//                   onCheckedChange={(checked: any) => handleStatusChange("found", checked)} className={undefined}                />
//                 <Label htmlFor="found" className="flex items-center gap-1.5">
//                   <Heart className="h-4 w-4 text-[#83C5BE]" />
//                   Found Pets
//                 </Label>
//               </div>
//             </div>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         <SidebarGroup className={undefined}>
//           <SidebarGroupLabel className={undefined}>Pet Type</SidebarGroupLabel>
//           <SidebarGroupContent className={undefined}>
//             <SidebarMenu className={undefined}>
//               <SidebarMenuItem className={undefined}>
//                 <SidebarMenuButton
//                   tooltip="Dogs"
//                   onClick={() => handlePetTypeChange("dog")}
//                   className={filters.petType === "dog" ? "bg-[#E29578]/10" : ""}
//                 >
//                   <Dog className="h-4 w-4" />
//                   <span>Dogs</span>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//               <SidebarMenuItem className={undefined}>
//                 <SidebarMenuButton
//                   tooltip="Cats"
//                   onClick={() => handlePetTypeChange("cat")}
//                   className={filters.petType === "cat" ? "bg-[#E29578]/10" : ""}
//                 >
//                   <Cat className="h-4 w-4" />
//                   <span>Cats</span>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//               <SidebarMenuItem className={undefined}>
//                 <SidebarMenuButton
//                   tooltip="Birds"
//                   onClick={() => handlePetTypeChange("bird")}
//                   className={filters.petType === "bird" ? "bg-[#E29578]/10" : ""}
//                 >
//                   <Bird className="h-4 w-4" />
//                   <span>Birds</span>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//               <SidebarMenuItem className={undefined}>
//                 <SidebarMenuButton
//                   tooltip="Other"
//                   onClick={() => handlePetTypeChange("other")}
//                   className={filters.petType === "other" ? "bg-[#E29578]/10" : ""}
//                 >
//                   <Rabbit className="h-4 w-4" />
//                   <span>Other</span>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         <SidebarGroup className={undefined}>
//           <SidebarGroupLabel className={undefined}>Date Range</SidebarGroupLabel>
//           <SidebarGroupContent className={undefined}>
//             <div className="space-y-2">
//               <div className="flex flex-col space-y-1.5">
//                 <Label htmlFor="date-from" className={undefined}>From</Label>
//                 {/* <DatePicker date={date} onSelect={setDate} /> */}
//               </div>
//               <div className="flex flex-col space-y-1.5">
//                 <Label htmlFor="date-to" className={undefined}>To</Label>
//                 {/* <DatePicker date={date} onSelect={setDate} /> */}
//               </div>
//             </div>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         <SidebarGroup className={undefined}>
//           <SidebarGroupLabel className={undefined}>Distance (km)</SidebarGroupLabel>
//           <SidebarGroupContent className={undefined}>
//             <div className="space-y-4">
//               <Slider
//                 defaultValue={[filters.distance]}
//                 value={[filters.distance]}
//                 onValueChange={handleDistanceChange}
//                 max={50}
//                 step={1} className={undefined}              />
//               <div className="flex justify-between text-xs text-gray-500">
//                 <span>0 km</span>
//                 <span>25 km</span>
//                 <span>50 km</span>
//               </div>
//             </div>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         <SidebarGroup className={undefined}>
//           <SidebarGroupContent className={undefined}>
//             <Button className="w-full" variant={undefined} size={undefined}>Apply Filters</Button>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   )
// }
