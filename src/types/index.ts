export interface ISwipe {
  id: string;
  swiperPet: string;
  swipedPet: string;
  action: 'like' | 'ignore' | 'super_like';
  createdAt: Date;
}

export interface IMatch {
  id: string;
  pet1: string;
  pet2: string;
  createdAt: Date;
}

export interface IMessage {
  id: string;
  matchId: string;
  sender: string;
  content: string;
  createdAt: Date;
}


///////////////////////////////////////////////////////////////////
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  bio?: string
  location?: string
  accType: "regular" | "provider"
  businessName?: string
  businessType?: string
  services?: string[]
  certifications?: string
  website?: string
}

export interface Pet {
  id: string
  name: string
  breed: string
  age: number
  description: string
  image?: string
  ownerId: string
  createdAt: string
}

export interface MarketplacePost {
  id: string
  title: string
  description: string
  price: number
  image?: string
  category: "pet" | "accessory" | "food" | "service"
  userId: string
  createdAt: string
}

export interface Service {
  id: string
  name: string
  description: string
  price: number
  image?: string
  providerId: string
  category: "veterinary" | "training" | "grooming" | "boarding"
}

export interface Appointment {
  id: string
  date: string
  time: string
  clientName: string
  serviceType: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
}

export interface LostFoundPost {
  id: string
  title: string
  description: string
  image?: string
  location: string
  type: "lost" | "found"
  userId: string
  createdAt: string
}

