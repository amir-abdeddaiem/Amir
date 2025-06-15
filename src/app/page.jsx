"use client";

import { useState, useEffect } from 'react';
import { Heart, MapPin, Phone, Mail, Search, Filter, PawPrint, Star, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import HeroSection from '@/components/home/hero/HeroSection';
import Footer from '@/components/footer/Footer';
const quotes = [
  {
    text: "Dogs are not our whole life, but they make our lives whole.",
    author: "Roger Caras"
  },
  {
    text: "The greatness of a nation can be judged by the way its animals are treated.",
    author: "Mahatma Gandhi"
  },
  {
    text: "Until one has loved an animal, a part of one's soul remains unawakened.",
    author: "Anatole France"
  },
  {
    text: "Animals are such agreeable friends—they ask no questions; they pass no criticisms.",
    author: "George Eliot"
  }
];

const newProducts = [
  {
    id: 1,
    name: "Premium Dog Food - Organic Blend",
    price: "$45.99",
    originalPrice: "$52.99",
    image: "https://images.pexels.com/photos/1407391/pexels-photo-1407391.jpeg?auto=compress&cs=tinysrgb&w=500",
    rating: 4.8,
    reviews: 124,
    category: "Food",
    isNew: true
  },
  {
    id: 2,
    name: "Interactive Cat Toy Set",
    price: "$24.99",
    originalPrice: "$29.99",
    image: "https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg?auto=compress&cs=tinysrgb&w=500",
    rating: 4.6,
    reviews: 89,
    category: "Toys",
    isNew: true
  },
  {
    id: 3,
    name: "Comfortable Pet Bed - Large",
    price: "$79.99",
    originalPrice: "$99.99",
    image: "https://images.pexels.com/photos/1954515/pexels-photo-1954515.jpeg?auto=compress&cs=tinysrgb&w=500",
    rating: 4.9,
    reviews: 156,
    category: "Accessories",
    isNew: true
  },
  {
    id: 4,
    name: "GPS Pet Tracker Collar",
    price: "$129.99",
    originalPrice: "$149.99",
    image: "https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=500",
    rating: 4.7,
    reviews: 67,
    category: "Tech",
    isNew: true
  }
];

const lostFoundAnimals = [
  {
    id: 1,
    type: "lost",
    animal: "Dog",
    breed: "Golden Retriever",
    name: "Max",
    location: "Central Park, NY",
    date: "2024-01-15",
    image: "https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Friendly golden retriever, responds to Max. Last seen wearing a red collar.",
    contact: "555-0123"
  },
  {
    id: 2,
    type: "found",
    animal: "Cat",
    breed: "Tabby",
    name: "Unknown",
    location: "Brooklyn, NY",
    date: "2024-01-18",
    image: "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Found this friendly tabby cat near the park. Well-fed and seems to be someone's pet.",
    contact: "555-0456"
  },
  {
    id: 3,
    type: "lost",
    animal: "Cat",
    breed: "Siamese",
    name: "Luna",
    location: "Queens, NY",
    date: "2024-01-20",
    image: "https://images.pexels.com/photos/991831/pexels-photo-991831.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Beautiful Siamese cat, very shy. Missing since last Tuesday.",
    contact: "555-0789"
  },
  {
    id: 4,
    type: "found",
    animal: "Dog",
    breed: "Mixed Breed",
    name: "Unknown",
    location: "Manhattan, NY",
    date: "2024-01-22",
    image: "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Found this sweet mixed breed dog wandering near the subway station.",
    contact: "555-0321"
  }
];

export default function Home() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filteredAnimals, setFilteredAnimals] = useState(lostFoundAnimals);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let filtered = lostFoundAnimals;
    
    if (filterType !== 'all') {
      filtered = filtered.filter(animal => animal.type === filterType);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(animal => 
        animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredAnimals(filtered);
  }, [searchTerm, filterType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
<HeroSection/>

      {/* Hero Section with Quotes */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-green-500/10"></div>
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="mb-8">
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 mb-4">
              Featured Quote
            </Badge>
            <div className="transition-all duration-500 ease-in-out">
              <blockquote className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                "{quotes[currentQuote].text}"
              </blockquote>
              <cite className="text-xl text-gray-600">— {quotes[currentQuote].author}</cite>
            </div>
          </div>
          
          <div className="flex justify-center space-x-2 mb-12">
            {quotes.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuote(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentQuote ? 'bg-orange-500 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-orange-100">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Pet's <span className="text-orange-500">Paradise</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover premium pet products and help reunite lost pets with their families. 
              Building a community where every pet is loved and cared for.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <Link href="/marcket_place" className="flex-1">
                            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white flex-1">
                Shop Now
              </Button>
              </Link>
              <Link href="/LostFoundPets" className="flex-1">
              <Button size="lg" variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50 flex-1">
                Report Lost Pet
              </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Products Section */}
      <section id="products" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 mb-4">
              New Arrivals
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Premium Pet Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our latest collection of high-quality products designed to keep your pets happy and healthy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {newProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {product.isNew && (
                    <Badge className="absolute top-3 left-3 bg-orange-500 text-white">
                      New
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    className="absolute top-3 right-3 bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 transition-colors"
                    variant="ghost"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-xs text-gray-500">({product.reviews})</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-600">{product.price}</span>
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                    </div>
                  </div>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lost & Found Section */}
      <section id="lost-found" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 mb-4">
              Community Help
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Lost & Found Pets
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Help reunite pets with their families. Every share and search makes a difference in bringing our furry friends home.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, breed, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 backdrop-blur-sm border-blue-200"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48 bg-white/80 backdrop-blur-sm border-blue-200">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Posts</SelectItem>
                  <SelectItem value="lost">Lost Pets</SelectItem>
                  <SelectItem value="found">Found Pets</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAnimals.map((animal) => (
              <Card key={animal.id} className="hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                <div className="relative">
                  <img
                    src={animal.image}
                    alt={animal.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge
                    className={`absolute top-3 left-3 ${
                      animal.type === 'lost' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    {animal.type === 'lost' ? 'Lost' : 'Found'}
                  </Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span>{animal.name !== 'Unknown' ? animal.name : 'Unknown Name'}</span>
                    <Badge variant="secondary" className="text-xs">
                      {animal.animal}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-sm font-medium text-gray-600">
                    {animal.breed}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                    {animal.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-orange-500" />
                    {new Date(animal.date).toLocaleDateString()}
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {animal.description}
                  </p>
                  <Button
                    className={`w-full ${
                      animal.type === 'lost' 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-green-500 hover:bg-green-600'
                    } text-white`}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Contact: {animal.contact}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAnimals.length === 0 && (
            <div className="text-center py-12">
              <PawPrint className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No pets found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or check back later.</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      

      {/* Footer */}
     <Footer/>
    </div>
  );
}