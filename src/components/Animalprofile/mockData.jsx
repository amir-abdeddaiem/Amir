export const mockAnimalData = {
  id: "1",
  name: "Max",
  type: "dog",
  breed: "Golden Retriever",
  age: "3",
  gender: "male",
  weight: "32",
  description:
    "Max is a friendly and energetic Golden Retriever who loves to play fetch and go for long walks. He's great with children and other dogs, and enjoys swimming whenever he gets the chance.",
  vaccinated: true,
  neutered: true,
  microchipped: false,
  friendly: {
    children: true,
    dogs: true,
    cats: false,
    other: true,
  },
  image: "/placeholder.svg?height=400&width=400&text=Max",
  owner: {
    id: "user1",
    name: "Jane Doe",
    image: "/placeholder.svg?height=100&width=100&text=JD",
  },
  createdAt: "2023-01-15",
};
