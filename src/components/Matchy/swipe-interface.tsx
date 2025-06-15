// components/SwipeInterface.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import TinderCard from 'react-tinder-card';
import axios from 'axios';
import { X, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMatchModal } from '@/hooks/use-match-modal';
import { motion } from 'framer-motion';
import { PetDetailModal } from './PetDetailModal';
import { EmptyState } from './EmptyState';
import { useUserData } from '@/contexts/UserData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Pet = {
  id: string;
  name: string;
  age: string;
  breed: string;
  image: string;
  bio: string;
  temperament: string[];
};

export default function SwipeInterface() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [swipedPets, setSwipedPets] = useState<Pet[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [goneIds, setGoneIds] = useState<Set<string>>(new Set());
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [userPets, setUserPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const { openMatchModal } = useMatchModal();
  const cardRefs = useRef<{ [key: number]: any }>({});
  const { userData, loading, error } = useUserData();

  // Fetch user's pets for selection
  useEffect(() => {
    if (!userData?.id) return;
    axios
      .get<{ pets: Pet[] }>('/api/matchy/animalUser', {
        headers: { 'x-user-id': userData.id },
      })
      .then((res) => {
        setUserPets(res.data.pets);
        if (res.data.pets.length > 0) {
          setSelectedPetId(res.data.pets[0].id);
        }
      })
      .catch((err) => console.error('Error fetching user pets:', err));
  }, [userData?.id]);

  // Fetch pets to swipe on
  useEffect(() => {
    if (!userData?.id || !selectedPetId) return;
    axios
      .get<{ pets: Pet[] }>('/api/matchy/animal', {
        headers: { 'x-user-id': userData.id },
      })
      .then((res) => {
        setPets(res.data.pets);
        setCurrentIndex(res.data.pets.length - 1);
      })
      .catch((err) => console.error('Error fetching swipeable pets:', err));
  }, [userData?.id, selectedPetId]);

  // Handle swipe action
  const swiped = async (dir: string, pet: Pet, idx: number) => {
    setSwipedPets((prev) => [pet, ...prev]);
    setCurrentIndex(idx - 1);

    if (selectedPetId && userData?.id) {
      let actionType: string;
      if (dir === 'left') {
        actionType = 'ignore';
      } else if (dir === 'right') {
        actionType = 'like';
      } else if (dir === 'up') {
        actionType = 'superlike';
      } else {
        return; // Invalid direction
      }

      try {
        console.log('Sending swipe request:', { swiperpet: selectedPetId, swipedpet: pet.id, actionType, userId: userData.id });
        const response = await axios.post(
          '/api/matchy/matches',
          {
            swiperpet: selectedPetId,
            swipedpet: pet.id,
            actionType,
          },
          {
            headers: { 'x-user-id': userData.id },
          }
        );

        if (response.data.match) {
          openMatchModal({ ...pet, age: Number(pet.age) });
        }
      } catch (error: any) {
        console.error(`Swipe error:`, error.response?.data || error.message);
      }
    }
  };

  const outOfFrame = (_: string, pet: Pet) => {
    setGoneIds((prev) => new Set(prev).add(pet.id));
  };

  const swipe = (dir: 'left' | 'up' | 'right') => {
    if (currentIndex < 0) return;
    cardRefs.current[currentIndex]?.swipe(dir);
  };

  const resetAll = () => {
    setGoneIds(new Set());
    setSwipedPets([]);
    if (!userData?.id) return;
    axios
      .get<{ pets: Pet[] }>('/api/matchy/animal', {
        headers: { 'x-user-id': userData.id },
      })
      .then((res) => {
        setPets(res.data.pets);
        setCurrentIndex(res.data.pets.length - 1);
      })
      .catch((err) => console.error('Error resetting pets:', err));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData?.id) {
    return <div>Please log in to start swiping.</div>;
  }

  if (!userPets.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p>No pets found. Add a pet to start swiping.</p>
        <Button onClick={() => window.location.href = '/add-pet'} className={undefined} variant={undefined} size={undefined}>Add a Pet</Button>
      </div>
    );
  }

  if (!selectedPetId) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p>Please select a pet to start swiping.</p>
        <Select onValueChange={setSelectedPetId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a pet" />
          </SelectTrigger>
          <SelectContent className={undefined} >
            {userPets.map((pet) => (
              <SelectItem key={pet.id} value={pet.id} className={undefined} >
                {pet.name} ({pet.breed})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (!pets.length || goneIds.size === pets.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <EmptyState />
        {selectedPet && (
          <PetDetailModal
            pet={{ ...selectedPet, age: Number(selectedPet.age) }}
            open={isDetailModalOpen}
            onOpenChange={setIsDetailModalOpen}
            onClose={() => {
              setSelectedPet(null);
              setIsDetailModalOpen(false);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between h-full max-w-md mx-auto">
      <div className="w-full p-4">
        <Select onValueChange={setSelectedPetId} value={selectedPetId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a pet" />
          </SelectTrigger>
          <SelectContent className={undefined} >
            {userPets.map((pet) => (
              <SelectItem key={pet.id} value={pet.id} className={undefined} >
                {pet.name} ({pet.breed})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="relative w-full h-[70vh] flex items-center justify-center">
        {pets.map((pet, idx) =>
          goneIds.has(pet.id) ? null : (
            <TinderCard
              key={idx}
              ref={(ref) => {
                if (ref) cardRefs.current[idx] = ref;
              }}
              onSwipe={(dir) => swiped(dir, pet, idx)}
              onCardLeftScreen={(dir) => outOfFrame(dir, pet)}
              preventSwipe={['down']}
              className="absolute w-full h-full"
            >
              <motion.div
                onDoubleClick={() => {
                  setSelectedPet(pet);
                  setIsDetailModalOpen(true);
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg bg-white cursor-pointer"
              >
                <img
                  src={pet.image || '/placeholder.svg'}
                  alt={`${pet.name}'s photo`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                  <h2 className="text-3xl font-bold">
                    {pet.name}, {pet.age}
                  </h2>
                  <p className="text-lg opacity-90">{pet.breed}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {pet.temperament.map((t, i) => (
                      <Badge key={i} className="bg-white/20 text-white" variant={undefined}>
                        {t}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-3 text-lg opacity-90">{pet.bio}</p>
                  <div className="absolute top-24 right-4 bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                    Double Click for details
                  </div>
                </div>
              </motion.div>
            </TinderCard>
          )
        )}
      </div>

      <div className="flex items-center justify-center gap-4 py-6">
        <Button
          size="icon"
          variant="outline"
          className="h-14 w-14 rounded-full border-2 border-red-500 text-red-500"
          onClick={() => swipe('left')}
          disabled={currentIndex < 0}
        >
          <X className="h-6 w-6" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="h-14 w-14 rounded-full border-2 border-blue-500 text-blue-500"
          onClick={() => swipe('up')}
          disabled={currentIndex < 0}
        >
          <Star className="h-6 w-6" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="h-14 w-14 rounded-full border-2 border-green-500 text-green-500"
          onClick={() => swipe('right')}
          disabled={currentIndex < 0}
        >
          <Heart className="h-6 w-6" />
        </Button>
      </div>

      {selectedPet && (
        <PetDetailModal
          pet={{ ...selectedPet, age: Number(selectedPet.age) }}
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          onClose={() => {
            setSelectedPet(null);
            setIsDetailModalOpen(false);
          }}
        />
      )}
    </div>
  );
}