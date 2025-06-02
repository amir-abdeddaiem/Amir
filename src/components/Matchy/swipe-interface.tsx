// components/SwipeInterface.tsx
'use client';
import { AnimatedTooltip } from "../ui/animated-tooltip";
import { useState, useEffect, useRef, act } from 'react';
import TinderCard from 'react-tinder-card';
import axios from 'axios';
import { X, Heart, Star, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMatchModal } from '@/hooks/use-match-modal';
import { motion } from 'framer-motion';
import { PetDetailModal } from './PetDetailModal';
import { EmptyState } from './EmptyState';
import { useUserData } from '@/contexts/UserData';
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
  const { openMatchModal } = useMatchModal();
  const cardRefs = useRef<{ [key: number]: typeof TinderCard | null }>({});
  const { userData, loading, error } = useUserData();
  console.log(userData)
  // Load pets on mount
  useEffect(() => {
    axios
      .get<{ pets: Pet[] }>('/api/matchy/animal')
      .then((res) => {
        setPets(res.data.pets);
        setCurrentIndex(res.data.pets.length - 1);
      })
      .catch(console.error);
  }, []);

  // Handle swipe action
  const swiped = async (dir: string, pet: Pet, idx: number) => {
    setSwipedPets((prev) => [pet, ...prev]);
    setCurrentIndex(idx - 1);

    if (dir === 'right') {
      try {
        const response = await axios.post('/api/matchy/matches', {
          swiped: pet.id,

          actionType: 'like',
        });


      } catch (error) {
        console.error('superLike error', error);
      }
    }
  };

  const outOfFrame = (_: string, pet: Pet) => {
    setGoneIds((prev) => new Set(prev).add(pet.id));
  };

  const swipe = (dir: 'left' | 'up' | 'right') => {
    if (currentIndex < 0) return;
    (cardRefs.current[currentIndex] as any)?.swipe(dir);
  };

  const resetAll = () => {
    setGoneIds(new Set());
    setSwipedPets([]);
    axios
      .get<{ pets: Pet[] }>('/api/matchy/animal')
      .then((res) => {
        setPets(res.data.pets);
        setCurrentIndex(res.data.pets.length - 1);
      });
  };

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

      <div className="relative w-full h-[70vh] flex items-center justify-center">
        {pets.map((pet, idx) =>
          goneIds.has(pet.id) ? null : (
            <TinderCard
              key={idx}
              ref={(ref) => {
                if (ref) cardRefs.current[idx] = ref as any;
              }}
              onSwipe={(dir) => swiped(dir, pet, idx)}
              onCardLeftScreen={(dir) => outOfFrame(dir, pet)}
              preventSwipe={['down']}
              className="absolute w-full h-full"
            >
              <motion.div
                onClick={() => {
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
                      <Badge
                        key={i}
                        className="bg-white/20 text-white"
                        variant={undefined}
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-3 text-lg opacity-90">{pet.bio}</p>
                  <div className="absolute top-4 right-4 bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                    Click for details
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

      {/* Optional Undo Button */}
      {/* {swipedPets.length > 0 && (
        <Button variant="ghost" onClick={rewind}>
          <RotateCcw className="h-5 w-5 mr-2" /> Undo
        </Button>
      )} */}

      {
        selectedPet && (
          <PetDetailModal
            pet={{ ...selectedPet, age: Number(selectedPet.age) }}
            open={isDetailModalOpen}
            onOpenChange={setIsDetailModalOpen}
            onClose={() => {
              setSelectedPet(null);
              setIsDetailModalOpen(false);
            }}
          />
        )
      }



    </div >


  );
}
