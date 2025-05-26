import React from "react";

export type Pet = {
    id: string; // Make sure this matches everywhere (string or number)
    name: string;
    age: number;
    breed: string;
    image: string;
    bio: string;
    temperament: string[];
};// ✅ Import shared Pet type

type Props = {
    pet: Pet;
    onClose: () => void;
};

export const PetDetailModal = ({ pet, onClose }: Props) => {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 relative shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-black"
                >
                    ✕
                </button>
                <img src={pet.image} alt={pet.name} className="w-full h-64 object-cover rounded-md mb-4" />
                <h2 className="text-2xl font-bold mb-2">{pet.name}, {pet.age}</h2>
                <p className="text-gray-600 mb-2">{pet.breed}</p>
                <p className="mb-4">{pet.bio}</p>
                <div className="flex flex-wrap gap-2">
                    {pet.temperament.map((tag) => (
                        <span key={tag} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};
