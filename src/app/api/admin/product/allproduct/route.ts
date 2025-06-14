import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find()
      .populate('user', 'firstName lastName email')
   
      .lean(); // Use lean() for better performance

    const formattedProducts = products.map(product => ({
      _id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images || [],
      category: product.category,
      localisation: product.localisation,
      featured: product.featured || false,
      petType: product.petType,
      quantity: product.quantity || 1,
      specifications: product.specifications || [],
      breed: product.breed,
      age: product.age,
      gender: product.gender,
      weight: product.weight,
      HealthStatus: product.HealthStatus || {
        vaccinated: false,
        neutered: false,
        microchipped: false,
      },
      friendly: product.friendly || {
        children: false,
        dogs: false,
        cats: false,
        animals: false,
      },
      Color: product.Color,
      listingType: product.listingType,
      user: product.user || null,
      reviews: product.reviews || [], // Fixed: Include reviews in response
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('GET Products Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error retrieving products',
        error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}