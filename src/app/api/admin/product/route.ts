import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import {Product} from '@/models/Product';

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

 

    const { searchParams } = new URL(req.url);
    const days = searchParams.get('days') || '30';
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const products = await Product.find({
      createdAt: { $gte: startDate, $lte: new Date() },
    });

    const categoryData: CategoryData[] = [
      { name: 'Food', value: 0, color: '#E29578' },
      { name: 'Toys', value: 0, color: '#006D77' },
      { name: 'Accessories', value: 0, color: '#83C5BE' },
      { name: 'Housing', value: 0, color: '#FFDDD2' },
      { name: 'Pets', value: 0, color: '#FFDDD2' },
      { name: 'Essentials', value: 0, color: '#FFDDD2' },
      { name: 'Furniture', value: 0, color: '#FFDDD2' },

    ];



    products.forEach((product: any) => {
      const entry = categoryData.find(d => d.name === product.category);
      if (entry) entry.value += 1;
    });

    const totalSales = products.reduce((sum: number, product: any) => sum + product.price, 0);

    return NextResponse.json({ categoryData, totalSales });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error fetching product data', error: error.message },
      { status: 500 }
    );
  }
}