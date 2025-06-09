"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function UserManagementDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeUser, setActiveUser] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get("/api/admin/user");
        setUsers(res.data.users || []);
        console.log(res.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const UserCard = ({ user }) => {
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    const avatarFallback = (user.firstName || "U")[0];

    return (
      <Card className="flex items-center gap-4 p-4">
        <Avatar>
          <AvatarImage src={user.avatar || "/default-avatar.jpg"} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-medium">{fullName || "Unnamed User"}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="flex gap-2 mt-2">
            <Badge>{user.accType || "regular"}</Badge>
            <Badge variant="outline">{user.status || "unknown"}</Badge>
          </div>
        </div>
        <DialogTrigger asChild>
          <Button onClick={() => setActiveUser(user)}>Details</Button>
        </DialogTrigger>
      </Card>
    );
  };

  return (
    <div className="p-6">
      <Tabs defaultValue="all" className="w-full max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="provider">Service Providers</TabsTrigger>
          <TabsTrigger value="pending">admin</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-4">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="flex items-center gap-4 p-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                    <Skeleton className="h-9 w-[80px]" />
                  </Card>
                ))
              : users.map((user) => <UserCard key={user._id} user={user} />)}
          </div>
        </TabsContent>

        <TabsContent value="provider">
          <div className="space-y-4">
            {loading
              ? Array.from({ length: 2 }).map((_, i) => (
                  <Card key={i} className="flex items-center gap-4 p-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                    <Skeleton className="h-9 w-[80px]" />
                  </Card>
                ))
              : users
                  .filter((u) => u.accType === "provider")
                  .map((user) => <UserCard key={user._id} user={user} />)}
          </div>
        </TabsContent>

        <TabsContent value="admin">
          <div className="space-y-4">
            {loading
              ? Array.from({ length: 2 }).map((_, i) => (
                  <Card key={i} className="flex items-center gap-4 p-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                    <Skeleton className="h-9 w-[80px]" />
                  </Card>
                ))
              : users
                  .filter((u) => u.accType === "admin")
                  .map((user) => <UserCard key={user._id} user={user} />)}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog
        open={!!activeUser}
        onOpenChange={(open) => !open && setActiveUser(null)}
      >
        <DialogContent ref={dialogRef}>
          {activeUser && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeUser.firstName} {activeUser.lastName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Email: {activeUser.email}</p>
                <p>Account Type: {activeUser.accType || "regular"}</p>
                <p>Status: {activeUser.status || "unknown"}</p>
                <p>
                  Joined:{" "}
                  {activeUser.createdAt
                    ? new Date(activeUser.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
                {activeUser.accType === "provider" && (
                  <>
                    <p>Business: {activeUser.businessName || "N/A"}</p>
                    <p>Business Type: {activeUser.businessType || "N/A"}</p>
                    <p>Services: {activeUser.services?.join(", ") || "N/A"}</p>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </CardFooter>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
