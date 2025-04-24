// import Navbar from "@/components/Navbar/Navbar";
// import Footer from "@/components/Footer/Footer";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Profile } from "./Profile";
// import { Pets } from "./Pets";
// import { Posts } from "./Posts";

// // Mock data - in a real app, you'd fetch this based on params.id
// const userData = {
//   id: "1",
//   firstName: "Jane",
//   lastName: "Doe",
//   email: "jane@example.com",
//   location: "New York, USA",
//   avatar: "/placeholder.svg?height=200&width=200&text=Jane",
//   bio: "Animal lover and proud pet parent. I have two dogs and a cat!",
//   pets: [
//     {
//       name: "Max",
//       type: "Dog",
//       breed: "Golden Retriever",
//       image: "/placeholder.svg?height=100&width=100&text=Max",
//     },
//     {
//       name: "Luna",
//       type: "Cat",
//       breed: "Siamese",
//       image: "/placeholder.svg?height=100&width=100&text=Luna",
//     },
//     {
//       name: "Rocky",
//       type: "Dog",
//       breed: "German Shepherd",
//       image: "/placeholder.svg?height=100&width=100&text=Rocky",
//     },
//   ],
//   posts: [
//     {
//       id: 1,
//       title: "My favorite pet toys",
//       content: "Here are some of my pets' favorite toys...",
//       likes: 15,
//       comments: 5,
//     },
//     {
//       id: 2,
//       title: "Tips for new pet owners",
//       content: "If you're a new pet owner, here are some tips...",
//       likes: 23,
//       comments: 8,
//     },
//   ],
// };

// export default function UserProfile({ params.id }: { params: { id: string } }) {
//   const user = userData;

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
//       <main className="container mx-auto px-4 py-8">
//         <div className="flex flex-col md:flex-row gap-8">
//           <aside className="md:w-1/3">
//             <Profile user={user} />
//           </aside>
//           <div className="md:w-2/3">
//             <Tabs defaultValue="pets" className="">
//               <TabsList className="w-full">
//                 <TabsTrigger value="pets" className="w-full">
//                   Pets
//                 </TabsTrigger>
//                 <TabsTrigger value="posts" className="w-full">
//                   Posts
//                 </TabsTrigger>
//               </TabsList>
//               <TabsContent value="pets" className="">
//                 <Pets pets={user.pets} />
//               </TabsContent>
//               <TabsContent value="posts" className="">
//                 <Posts posts={user.posts} />
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }