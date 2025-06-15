'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, MessageCircle, Heart, PawPrint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { useUserData } from '@/contexts/UserData';

type Match = {
  id: string;
  name: string;
  image: string;
  lastMessage?: string;
  unread?: boolean;
  animalType?: 'dog' | 'cat' | 'rabbit' | 'bird';
};

export default function MessengerSidebar({
  isOpen,
  setIsOpen,
  selectedPetId,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedPetId?: string | null;
}) {
  const [activeTab, setActiveTab] = useState<'matches' | 'likes'>('matches');
  const [matches, setMatches] = useState<Match[]>([]);
  const [likedPets, setLikedPets] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userData, loading: userLoading, error: userError } = useUserData();

  // Fetch matches and superlikes when tab or dependencies change
  useEffect(() => {
    if (!userData?.id || userLoading || userError) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (activeTab === 'matches' && selectedPetId) {
          // Fetch matches only if selectedPetId is defined
          const response = await axios.get<{ matches: any[] }>('/api/matchy/matches', {
            headers: { 'x-user-id': userData.id },
            params: { animalId: selectedPetId },
          });

          const transformedMatches = response.data.matches.map((match) => {
            const otherPet = match.pet1._id.toString() === selectedPetId ? match.pet2 : match.pet1;
            return {
              id: otherPet._id.toString(),
              name: otherPet.name || 'Unknown Pet',
              image: otherPet.image || '/default-pet.png',
              animalType: otherPet.type?.toLowerCase() as 'dog' | 'cat' | 'rabbit' | 'bird',
              lastMessage: undefined,
              unread: false,
            };
          });
          setMatches(transformedMatches);
        } else if (activeTab === 'matches') {
          // No pet selected, show empty matches
          setMatches([]);
        } else if (activeTab === 'likes' && selectedPetId) {
          // Fetch superlikes for the selected pet
          const response = await axios.get<{ swipes: any[] }>('/api/matchy/likesU', {
            headers: { 'x-user-id': userData.id },
            params: { swiped: selectedPetId, actionType: 'superlike' },
          });

          const pets = response.data.swipes.map((swipe) => ({
            id: swipe.swiperpet._id.toString(),
            name: swipe.swiperpet.name || 'Unknown Pet',
            image: swipe.swiperpet.image || '/default-pet.png',
            animalType: swipe.swiperpet.type?.toLowerCase() as 'dog' | 'cat' | 'rabbit' | 'bird',
            lastMessage: undefined,
            unread: false,
          }));
          setLikedPets(pets);
        } else if (activeTab === 'likes') {
          // No pet selected, show empty liked pets
          setLikedPets([]);
        }
      } catch (err: any) {
        console.error(`Error fetching ${activeTab}:`, err.response?.data || err.message);
        setError(`Failed to load ${activeTab}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, userData?.id, selectedPetId, userLoading, userError]);

  const handleLogoClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={cn(
        'h-full border-r bg-[#EDF6F9] transition-all duration-300 ease-in-out shadow-lg',
        isOpen ? 'w-80' : 'w-20'
      )}
    >
      {isOpen ? (
        <div className="w-full">
          <div className="flex border-b border-[#83C5BE]">
            <button
              onClick={() => setActiveTab('matches')}
              className={cn(
                'flex-1 py-3 text-center font-medium transition-colors',
                activeTab === 'matches'
                  ? 'text-[#E29578] border-b-2 border-[#E29578] bg-[#FFDDD2]'
                  : 'text-[#83C5BE] hover:bg-[#FFDDD2]'
              )}
            >
              Matches
            </button>
            <button
              onClick={() => setActiveTab('likes')}
              className={cn(
                'flex-1 py-3 text-center font-medium transition-colors',
                activeTab === 'likes'
                  ? 'text-[#E29578] border-b-2 border-[#E29578] bg-[#FFDDD2]'
                  : 'text-[#83C5BE] hover:bg-[#FFDDD2]'
              )}
            >
              Likes You
            </button>
          </div>

          <div className="overflow-y-auto h-[calc(100vh-120px)] bg-[#EDF6F9]">
            {userLoading ? (
              <div className="flex justify-center items-center h-20">
                <PawPrint className="h-6 w-6 animate-pulse text-[#E29578]" />
                <span className="ml-2 text-[#006D77]">Loading...</span>
              </div>
            ) : userError ? (
              <div className="text-center text-red-500 py-4">{userError}</div>
            ) : !userData?.id ? (
              <div className="text-center text-[#83C5BE] py-4">Please log in to view matches</div>
            ) : (
              <>
                {activeTab === 'matches' && (
                  <div className="space-y-2 p-3">
                    {isLoading ? (
                      <div className="flex justify-center items-center h-20">
                        <PawPrint className="h-6 w-6 animate-pulse text-[#E29578]" />
                        <span className="ml-2 text-[#006D77]">Loading...</span>
                      </div>
                    ) : error ? (
                      <div className="text-center text-red-500 py-4">
                        {error}
                        <Button
                          variant="ghost"
                          className="mt-2 text-[#E29578]"
                          onClick={() => setActiveTab('matches')} size={undefined}                        >
                          Retry
                        </Button>
                      </div>
                    ) : selectedPetId ? (
                      matches.length > 0 ? (
                        matches.map((match) => <MatchItem key={match.id} match={match} />)
                      ) : (
                        <div className="text-center text-[#83C5BE] py-4">No matches yet for this pet</div>
                      )
                    ) : (
                      <div className="text-center text-[#83C5BE] py-4">Please select a pet to see matches</div>
                    )}
                  </div>
                )}
                {activeTab === 'likes' && (
                  <div className="space-y-2 p-3">
                    {!selectedPetId ? (
                      <div className="text-center text-[#83C5BE] py-4">
                        Please select a pet to see who likes you
                      </div>
                    ) : isLoading ? (
                      <div className="flex justify-center items-center h-20">
                        <PawPrint className="h-6 w-6 animate-pulse text-[#E29578]" />
                        <span className="ml-2 text-[#006D77]">Loading...</span>
                      </div>
                    ) : error ? (
                      <div className="text-center text-red-500 py-4">
                        {error}
                        <Button
                          variant="ghost"
                          className="mt-2 text-[#E29578]"
                          onClick={() => setActiveTab('likes')} size={undefined}                        >
                          Retry
                        </Button>
                      </div>
                    ) : likedPets.length > 0 ? (
                      likedPets.map((pet) => <MatchItem key={pet.id} match={pet} />)
                    ) : (
                      <div className="text-center text-[#83C5BE] py-4">
                        No pets have superliked your pet yet
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 pt-4 bg-[#EDF6F9]">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'rounded-full transition-all hover:bg-[#FFDDD2]',
              activeTab === 'matches' && 'bg-[#FFDDD2] text-[#E29578]'
            )}
            onClick={() => setActiveTab('matches')}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'rounded-full transition-all hover:bg-[#FFDDD2]',
              activeTab === 'likes' && 'bg-[#FFDDD2] text-[#E29578]'
            )}
            onClick={() => setActiveTab('likes')}
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}

function MatchItem({ match }: { match: Match }) {
  const getAnimalEmoji = (type?: string) => {
    switch (type) {
      case 'dog':
        return '🐕';
      case 'cat':
        return '🐈';
      case 'rabbit':
        return '🐇';
      case 'bird':
        return '🐦';
      default:
        return '🐾';
    }
  };

  return (
    <button className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all hover:bg-[#FFDDD2] hover:shadow-md border border-transparent hover:border-[#83C5BE]">
      <div className="relative">
        <Avatar className="h-12 w-12 border-2 border-[#E29578]">
          <img src={match.image} alt={match.name} className="object-cover" />
        </Avatar>
        <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 text-xs">
          {getAnimalEmoji(match.animalType)}
        </span>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <p className="font-medium text-[#006D77]">{match.name}</p>
          {match.unread && (
            <span className="h-2.5 w-2.5 rounded-full bg-[#E29578] animate-pulse"></span>
          )}
        </div>
        {match.lastMessage && (
          <p className="truncate text-sm text-[#83C5BE]">{match.lastMessage}</p>
        )}
      </div>
    </button>
  );
}