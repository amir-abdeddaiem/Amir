'use client';

import { useState, useEffect, SetStateAction } from 'react';
import { Search, Filter, AlertTriangle, Heart, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PetDetailsDialog } from '@/components/Lostfoundanimal/pet-details-dialog';
import axios from 'axios';
import { useUserData } from '@/contexts/UserData';
// import { toast } from 'react-hot-toast';

interface Animal {
  _id: string;
  name: string;
  type: string;
  breed: string;
  color: string;
  gender: string;
  description?: string;
  image?: string;
  lost: boolean;
  createdAt: string;
  location?: string; // Added for display; replace with real location data if available
}

interface FoundAnimal {
  _id: string;
  type: string;
  breed: string;
  color: string;
  gender: string;
  description: string;
  image: string;
  createdAt: string;
  location?: string; // Added for display; replace with real location data if available
}

export function AnimalList() {
  const [filters, setFilters] = useState({
    status: { lost: true, found: true },
    petType: 'all',
    searchTerm: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPet, setSelectedPet] = useState<Animal | FoundAnimal | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [foundAnimals, setFoundAnimals] = useState<FoundAnimal[]>([]);
  const { userData, loading } = useUserData();

  useEffect(() => {
    if (userData) {
      fetchAnimals();
      fetchFoundAnimals();
    }
  }, [userData]);

  const fetchAnimals = async () => {
    try {
      const response = await axios.get('/api/animals');
      // Add placeholder location for demo; replace with real data if available
      const animalsWithLocation = response.data.data.map((animal: Animal) => ({
        ...animal,
        location: animal.location || 'Unknown',
      }));
      setAnimals(animalsWithLocation);
    } catch (error) {
      console.log('response.data')
      // toast.error('Failed to fetch lost animals');
    }
  };

  const fetchFoundAnimals = async () => {
    try {
      const response = await axios.get('/api/foundanimal');
      // Add placeholder location for demo; replace with real data if available
      const foundAnimalsWithLocation = response.data.data.map((animal: FoundAnimal) => ({
        ...animal,
        location: animal.location || 'Unknown',
      }));
      setFoundAnimals(foundAnimalsWithLocation);
    } catch (error) {
      console.log('a')
      // toast.error('Failed to fetch found animals');
    }
  };

  const filteredPets = [...animals.filter(a => a.lost), ...foundAnimals].filter((pet) => {
    // Filter by search term
    const matchesSearch =
      ('name' in pet && pet.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.color.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by status
    const matchesStatus = 'lost' in pet ? (pet.lost && filters.status.lost) : filters.status.found;

    // Filter by type
    const matchesType = filters.petType === 'all' || pet.type === filters.petType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: key === 'status' ? { ...prev.status, ...value } : value,
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Recent Reports</h2>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search by name, breed, or color..."
              className="pl-8"
              value={searchTerm}
              onChange={(e: { target: { value: SetStateAction<string>; }; }) => setSearchTerm(e.target.value)} type={undefined} />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              // Toggle filter options (could open a modal or dropdown)
              handleFilterChange('status', {
                lost: !filters.status.lost,
                found: filters.status.found,
              });
            }} className={undefined}          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPets.length > 0 ? (
          filteredPets.map((pet) => (
            <Card
              key={pet._id}
              className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#E29578]/10"
              onClick={() => {
                setSelectedPet(pet);
                setIsDetailsOpen(true);
              }}
            >
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={pet.image || '/placeholder.svg'}
                  alt={'name' in pet ? pet.name : 'Found pet'}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardHeader className="p-3 pb-0">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{'name' in pet ? pet.name : pet.type}</CardTitle>
                    <CardDescription>{pet.breed}</CardDescription>
                  </div>
                  <Badge
                    className={'lost' in pet && pet.lost
                      ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                      : 'bg-[#83C5BE]/20 text-[#83C5BE] hover:bg-[#83C5BE]/30'} variant={undefined}                  >
                    {'lost' in pet && pet.lost ? (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Lost
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        Found
                      </div>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-2">
                <p className="line-clamp-2 text-sm text-gray-500">{pet.description || 'No description available'}</p>
              </CardContent>
              <CardFooter className="flex items-center gap-4 border-t p-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {pet.location || 'Unknown'}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(pet.createdAt).toLocaleDateString()}
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center">
            <div className="mb-3 rounded-full bg-[#E29578]/10 p-3">
              <Search className="h-6 w-6 text-[#E29578]" />
            </div>
            <h3 className="mb-1 text-lg font-medium">No pets found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      <PetDetailsDialog pet={selectedPet} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
    </div>
  );
}