"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import toast, { Toaster } from "react-hot-toast";

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
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function UserManagementDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get("/api/admin/user/users");
        if (!response.data) {
          throw new Error("No data received from API");
        }
        const usersData = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setUsers(usersData);
      } catch (err) {
        console.error("Error fetching users:", err);
        setUsers([]);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleEditUser = (userId, updatedData) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, ...updatedData } : user
      )
    );
  };

  const handleDeleteUser = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
  };

  return (
    <div className="p-6 bg-[#EDF6F9] min-h-screen">
      <Tabs defaultValue="all" className="w-full max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#FFDDD2] rounded-lg">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-[#006D77] data-[state=active]:text-white text-[#006D77]"
          >
            All Users
          </TabsTrigger>
          <TabsTrigger
            value="provider"
            className="data-[state=active]:bg-[#006D77] data-[state=active]:text-white text-[#006D77]"
          >
            Service Providers
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="space-y-4">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Card
                    key={i}
                    className="flex items-center gap-4 p-4 border-[#006D77] bg-white"
                  >
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                    <Skeleton className="h-9 w-[80px]" />
                  </Card>
                ))
              : users.map((user, index) => (
                  <UserCard
                    key={index}
                    user={user}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                  />
                ))}
          </div>
        </TabsContent>
        <TabsContent value="provider">
          <div className="space-y-4">
            {loading
              ? Array.from({ length: 2 }).map((_, i) => (
                  <Card
                    key={i}
                    className="flex items-center gap-4 p-4 border-[#006D77] bg-white"
                  >
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
                  .map((user, index) => (
                    <UserCard
                      key={index}
                      user={user}
                      onEdit={handleEditUser}
                      onDelete={handleDeleteUser}
                    />
                  ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const UserCard = ({ user, onEdit, onDelete }) => {
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const avatarFallback = (user.firstName || "U")[0];
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    accType: user.accType || "regular",
    gender: user.gender || "",
    birthDate: user.birthDate
      ? new Date(user.birthDate).toISOString().split("T")[0]
      : "",
    location: user.location || "",
    phone: user.phone || "",
    avatar: user.avatar || "",
    bio: user.bio || "",
    businessName: user.businessName || "",
    boutiqueImage: user.boutiqueImage || "",
    services: user.services?.join(", ") || "",
    certifications: user.certifications || "",
    description: user.description || "",
    website: user.website || "",
  });

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.firstName || !editForm.email) {
      toast.error("First name and email are required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      toast.error("Invalid email format");
      return;
    }
    if (editForm.services && typeof editForm.services !== "string") {
      toast.error("Services must be a comma-separated string");
      return;
    }
    try {
      const payload = {
        ...editForm,
        services: editForm.services
          ? editForm.services
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
          : [],
      };
      await axios.patch(`/api/admin/user/users/${user._id}`, payload);
      onEdit(user._id, payload);
      setIsEditOpen(false);
      toast.success("User updated successfully");
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error(err.response?.data?.message || "Failed to update user");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/admin/user/users/${user._id}`);
      onDelete(user._id);
      setIsDeleteOpen(false);
      toast.success("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <Card className="flex items-center gap-4 p-4 border-[#006D77] bg-white">
        {/* User content */}
        {user.accType === "provider" ? (
          <div className="flex items-center gap-4 flex-1">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={user.boutiqueImage || "/default-boutique.jpg"}
                alt={`${user.businessName || "Business"} avatar`}
              />
              <AvatarFallback className="bg-[#FFDDD2] text-[#006D77] font-medium">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-medium text-lg text-[#006D77]">
                {user.businessName || "Unnamed Business"}
              </h3>
              {user.services?.length > 0 ? (
                <ul className="flex flex-wrap gap-2 mt-1">
                  {user.services.map((service, index) => (
                    <li key={index}>
                      <Badge className="bg-[#83C5BE]/20 text-[#006D77] hover:bg-[#83C5BE]/30">
                        {service}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#006D77]/80 italic">
                  No services listed
                </p>
              )}
              <div className="flex gap-2 mt-2">
                <Badge className="bg-[#006D77] text-white hover:bg-[#006D77]/90">
                  {user.accType || "Provider"}
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 flex-1">
            <Avatar>
              <AvatarImage src={user.avatar || "/default-avatar.jpg"} />
              <AvatarFallback className="bg-[#FFDDD2] text-[#006D77]">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-medium text-[#006D77]">
                {fullName || "Unnamed User"}
              </h3>
              <p className="text-sm text-[#006D77]/80">{user.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge className="bg-[#E29578] text-white hover:bg-[#D17A60]">
                  {user.accType || "regular"}
                </Badge>
              </div>
            </div>
          </div>
        )}
        {/* Buttons moved to the right */}
        <div className="flex gap-2">
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-[#83C5BE] text-white hover:bg-[#83C5BE]/90"
                aria-label={`View details of ${fullName}`}
              >
                Details
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#EDF6F9] max-h-[80vh] overflow-y-auto">
              <VisuallyHidden>
                <DialogTitle>{fullName || "User Details"}</DialogTitle>
              </VisuallyHidden>
              <Card className="border-[#006D77] bg-white">
                <CardHeader>
                  <CardTitle className="text-[#006D77]">
                    {user.firstName} {user.lastName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-[#006D77]">
                  <p>Email: {user.email}</p>
                  <p>Account Type: {user.accType || "regular"}</p>
                  <p>Gender: {user.gender || "N/A"}</p>
                  <p>
                    Birth Date:{" "}
                    {user.birthDate
                      ? new Date(user.birthDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p>Location: {user.location || "N/A"}</p>
                  <p>Phone: {user.phone || "N/A"}</p>
                  <p>
                    Avatar:{" "}
                    {user.avatar ? (
                      <a
                        href={user.avatar}
                        target="_blank"
                        className="underline"
                      >
                        View
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </p>
                  <p>Bio: {user.bio || "N/A"}</p>
                  <p>
                    Joined:{" "}
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                  {user.accType === "provider" && (
                    <>
                      <p>Business: {user.businessName || "N/A"}</p>
                      <p>
                        Boutique Image:{" "}
                        {user.boutiqueImage ? (
                          <a
                            href={user.boutiqueImage}
                            target="_blank"
                            className="underline"
                          >
                            View
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </p>
                      <p>Services: {user.services?.join(", ") || "N/A"}</p>
                      <p>Certifications: {user.certifications || "N/A"}</p>
                      <p>Description: {user.description || "N/A"}</p>
                      <p>
                        Website:{" "}
                        {user.website ? (
                          <a
                            href={user.website}
                            target="_blank"
                            className="underline"
                          >
                            {user.website}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </p>
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <DialogClose asChild>
                    <Button className="bg-[#FFDDD2] text-[#006D77] hover:bg-[#FFDDD2]/80">
                      Close
                    </Button>
                  </DialogClose>
                </CardFooter>
              </Card>
            </DialogContent>
          </Dialog>
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-[#FFDDD2] text-[#006D77] hover:bg-[#FFDDD2]/80"
                aria-label={`Edit ${fullName}`}
              >
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#EDF6F9] max-h-[80vh] overflow-y-auto">
              <VisuallyHidden>
                <DialogTitle>Edit User</DialogTitle>
              </VisuallyHidden>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="firstName" className="text-[#006D77]">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    value={editForm.firstName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, firstName: e.target.value })
                    }
                    className="border-[#006D77] focus:ring-[#E29578]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-[#006D77]">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={editForm.lastName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, lastName: e.target.value })
                    }
                    className="border-[#006D77] focus:ring-[#E29578]"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-[#006D77]">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="border-[#006D77] focus:ring-[#E29578]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="accType" className="text-[#006D77]">
                    Account Type
                  </Label>
                  <Select
                    value={editForm.accType}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, accType: value })
                    }
                  >
                    <SelectTrigger className="border-[#006D77] focus:ring-[#E29578]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#EDF6F9]">
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="provider">Provider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="gender" className="text-[#006D77]">
                    Gender
                  </Label>
                  <Select
                    value={editForm.gender}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, gender: value })
                    }
                  >
                    <SelectTrigger className="border-[#006D77] focus:ring-[#E29578]">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#EDF6F9]">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="birthDate" className="text-[#006D77]">
                    Birth Date
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={editForm.birthDate}
                    onChange={(e) =>
                      setEditForm({ ...editForm, birthDate: e.target.value })
                    }
                    className="border-[#006D77] focus:ring-[#E29578]"
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-[#006D77]">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={editForm.location}
                    onChange={(e) =>
                      setEditForm({ ...editForm, location: e.target.value })
                    }
                    className="border-[#006D77] focus:ring-[#E29578]"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-[#006D77]">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    className="border-[#006D77] focus:ring-[#E29578]"
                  />
                </div>
                <div>
                  <Label htmlFor="avatar" className="text-[#006D77]">
                    Avatar URL
                  </Label>
                  <Input
                    id="avatar"
                    type="url"
                    value={editForm.avatar}
                    onChange={(e) =>
                      setEditForm({ ...editForm, avatar: e.target.value })
                    }
                    className="border-[#006D77] focus:ring-[#E29578]"
                  />
                </div>
                <div>
                  <Label htmlFor="bio" className="text-[#006D77]">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={editForm.bio}
                    onChange={(e) =>
                      setEditForm({ ...editForm, bio: e.target.value })
                    }
                    className="border-[#006D77] focus:ring-[#E29578]"
                  />
                </div>
                {editForm.accType === "provider" && (
                  <>
                    <div>
                      <Label htmlFor="businessName" className="text-[#006D77]">
                        Business Name
                      </Label>
                      <Input
                        id="businessName"
                        value={editForm.businessName}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            businessName: e.target.value,
                          })
                        }
                        className="border-[#006D77] focus:ring-[#E29578]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="boutiqueImage" className="text-[#006D77]">
                        Boutique Image URL
                      </Label>
                      <Input
                        id="boutiqueImage"
                        type="url"
                        value={editForm.boutiqueImage}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            boutiqueImage: e.target.value,
                          })
                        }
                        className="border-[#006D77] focus:ring-[#E29578]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="services" className="text-[#006D77]">
                        Services (comma-separated)
                      </Label>
                      <Input
                        id="services"
                        value={editForm.services}
                        onChange={(e) =>
                          setEditForm({ ...editForm, services: e.target.value })
                        }
                        className="border-[#006D77] focus:ring-[#E29578]"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="certifications"
                        className="text-[#006D77]"
                      >
                        Certifications
                      </Label>
                      <Textarea
                        id="certifications"
                        value={editForm.certifications}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            certifications: e.target.value,
                          })
                        }
                        className="border-[#006D77] focus:ring-[#E29578]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-[#006D77]">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                        className="border-[#006D77] focus:ring-[#E29578]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website" className="text-[#006D77]">
                        Website
                      </Label>
                      <Input
                        id="website"
                        type="url"
                        value={editForm.website}
                        onChange={(e) =>
                          setEditForm({ ...editForm, website: e.target.value })
                        }
                        className="border-[#006D77] focus:ring-[#E29578]"
                      />
                    </div>
                  </>
                )}
                <div className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      className="bg-[#FFDDD2] text-[#006D77] hover:bg-[#FFDDD2]/80"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    className="bg-[#E29578] text-white hover:bg-[#D17A60]"
                  >
                    Save
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-[#E29578] text-white hover:bg-[#D17A60]"
                aria-label={`Delete ${fullName}`}
              >
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#EDF6F9]">
              <VisuallyHidden>
                <DialogTitle>Confirm Delete</DialogTitle>
              </VisuallyHidden>
              <div className="space-y-4">
                <p className="text-[#006D77]">
                  Are you sure you want to delete {fullName || "this user"}?
                </p>
                <div className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button className="bg-[#FFDDD2] text-[#006D77] hover:bg-[#FFDDD2]/80">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={handleDelete}
                    className="bg-[#E29578] text-white hover:bg-[#D17A60]"
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </>
  );
};
