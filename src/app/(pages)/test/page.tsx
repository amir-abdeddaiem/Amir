'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserData } from '@/contexts/UserData';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface Animal {
  _id: string;
  name: string;
  type: string;
  breed: string;
  color: string;
  gender: string;
  image?: string;
  lost: boolean;
}

interface FoundAnimal {
  _id: string;
  color: string;
  image: string;
  description: string;
  breed: string;
  gender: string;
  type: string;
}

const FoundLostAnimal = () => {
  const { userData, loading } = useUserData();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [foundAnimals, setFoundAnimals] = useState<FoundAnimal[]>([]);
  const [formData, setFormData] = useState({
    color: '',
    image: '',
    description: '',
    breed: '',
    gender: '',
    type: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      fetchUserAnimals();
      fetchFoundAnimals();
    }
  }, [userData]);

  const fetchUserAnimals = async () => {
    try {
      const response = await axios.get('/api/animals');
      setAnimals(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch your animals');
    }
  };

  const fetchFoundAnimals = async () => {
    try {
      const response = await axios.get('/api/foundanimal');
      setFoundAnimals(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch found animals');
    }
  };

  const handleReportLost = async (animalId: string, lost: boolean) => {
    try {
      await axios.patch(`/api/animals/${animalId}`, { lost });
      toast.success(`Animal marked as ${lost ? 'lost' : 'found'}`);
      fetchUserAnimals();
    } catch (error) {
      toast.error('Failed to update animal status');
    }
  };

  const handleSubmitFoundAnimal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('/api/foundanimal', formData);
      toast.success('Found animal reported successfully');
      setFormData({ color: '', image: '', description: '', breed: '', gender: '', type: '' });
      fetchFoundAnimals();
    } catch (error) {
      toast.error('Failed to report found animal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Lost & Found Animals</h1>

      {/* User's Animals Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Animals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {animals.map(animal => (
            <div key={animal._id} className="border p-4 rounded-lg">
              {animal.image && (
                <img
                  src={animal.image}
                  alt={animal.name}
                  width={200}
                  height={200}
                  className="w-full h-48 object-cover rounded-md mb-2"
                />
              )}
              <h3 className="text-lg font-medium">{animal.name}</h3>
              <p>Type: {animal.type}</p>
              <p>Breed: {animal.breed}</p>
              <p>Color: {animal.color}</p>
              <p>Gender: {animal.gender}</p>
              <button
                onClick={() => handleReportLost(animal._id, !animal.lost)}
                className={`mt-2 px-4 py-2 rounded ${animal.lost ? 'bg-green-500' : 'bg-red-500'} text-white`}
              >
                {animal.lost ? 'Mark as Found' : 'Mark as Lost'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Report Found Animal Form */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Report Found Animal</h2>
        <form onSubmit={handleSubmitFoundAnimal} className="space-y-4">
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            placeholder="Animal Type (e.g., Dog, Cat)"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="breed"
            value={formData.breed}
            onChange={handleInputChange}
            placeholder="Breed"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            placeholder="Color"
            className="w-full p-2 border rounded"
            required
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="Image URL"
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          >
            {isLoading ? 'Submitting...' : 'Report Found Animal'}
          </button>
        </form>
      </div>

      {/* Found Animals List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Found Animals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foundAnimals.map(animal => (
            <div key={animal._id} className="border p-4 rounded-lg">
              <img
                src={animal.image}
                alt="Found animal"
                width={200}
                height={200}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <p>Type: {animal.type}</p>
              <p>Breed: {animal.breed}</p>
              <p>Color: {animal.color}</p>
              <p>Gender: {animal.gender}</p>
              <p>Description: {animal.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoundLostAnimal;