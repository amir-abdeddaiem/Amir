import { NextResponse } from 'next/server';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';
import {connectDB} from '@/lib/mongodb';
import {Animal} from '@/models/Animal';
import {User} from '@/models/User';
import {Product} from '@/models/Product';

// Define interfaces for data structures
interface AnimalData {
  totalAnimals: number;
  animalData: { type: string; count: number; lost: number; found: number }[];
}

interface UserData {
  activeUsers: number;
  engagementData: { month: string; users: number; active: number }[];
  providerBookings: {
    month: string;
    veterinarians: number;
    trainers: number;
    groomers: number;
    shelter: number;
    surgery: number;
  }[];
}

interface ProductData {
  totalSales: number;
  categoryData: { name: string; value: number }[];
}

// Helper to calculate date range
const getDateRange = (days: string): { startDate: Date; endDate: Date } => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - parseInt(days));
  return { startDate, endDate };
};

// Fetch animal data
const fetchAnimalData = async (days: string, userId?: string): Promise<AnimalData> => {
  await connectDB();
  const { startDate, endDate } = getDateRange(days);
  const query = userId
    ? { userId, createdAt: { $gte: startDate, $lte: endDate } }
    : { createdAt: { $gte: startDate, $lte: endDate } };

  const animals = await Animal.aggregate([
    { $match: query },
    {
      $group: {
        _id: { type: '$type', status: '$status' },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: '$_id.type',
        total: { $sum: '$count' },
        lost: { $sum: { $cond: [{ $eq: ['$_id.status', 'lost'] }, '$count', 0] } },
        found: { $sum: { $cond: [{ $eq: ['$_id.status', 'found'] }, '$count', 0] } },
      },
    },
    {
      $project: {
        type: '$_id',
        count: '$total',
        lost: '$lost',
        found: '$found',
        _id: 0,
      },
    },
  ]);

  const totalAnimals = await Animal.countDocuments(query);

  return { totalAnimals, animalData: animals };
};

// Fetch user data
const fetchUserData = async (days: string, userId?: string): Promise<UserData> => {
  await connectDB();
  const { startDate, endDate } = getDateRange(days);
  const query = userId
    ? { userId, lastActive: { $gte: startDate, $lte: endDate } }
    : { lastActive: { $gte: startDate, $lte: endDate } };

  const activeUsers = await User.countDocuments({ ...query, isActive: true });

  const engagementData = await User.aggregate([
    { $match: query },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$lastActive' } },
        users: { $sum: 1 },
        active: { $sum: { $cond: ['$isActive', 1, 0] } },
      },
    },
    {
      $project: {
        month: '$_id',
        users: 1,
        active: 1,
        _id: 0,
      },
    },
    { $sort: { month: 1 } },
  ]);

  const providerBookings = await User.aggregate([
    { $match: userId ? { userId } : {} },
    { $unwind: '$bookings' },
    { $match: { 'bookings.createdAt': { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: {
          month: { $dateToString: { format: '%Y-%m', date: '$bookings.createdAt' } },
          providerType: '$bookings.providerType',
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: '$_id.month',
        veterinarians: {
          $sum: { $cond: [{ $eq: ['$_id.providerType', 'veterinarians'] }, '$count', 0] },
        },
        trainers: {
          $sum: { $cond: [{ $eq: ['$_id.providerType', 'trainers'] }, '$count', 0] },
        },
        groomers: {
          $sum: { $cond: [{ $eq: ['$_id.providerType', 'groomers'] }, '$count', 0] },
        },
        shelter: {
          $sum: { $cond: [{ $eq: ['$_id.providerType', 'shelter'] }, '$count', 0] },
        },
        surgery: {
          $sum: { $cond: [{ $eq: ['$_id.providerType', 'surgery'] }, '$count', 0] },
        },
      },
    },
    {
      $project: {
        month: '$_id',
        veterinarians: 1,
        trainers: 1,
        groomers: 1,
        shelter: 1,
        surgery: 1,
        _id: 0,
      },
    },
    { $sort: { month: 1 } },
  ]);

  return { activeUsers, engagementData, providerBookings };
};

// Fetch product data
const fetchProductData = async (days: string, userId?: string): Promise<ProductData> => {
  await connectDB();
  const { startDate, endDate } = getDateRange(days);
  const query = userId
    ? { userId, createdAt: { $gte: startDate, $lte: endDate } }
    : { createdAt: { $gte: startDate, $lte: endDate } };

  const totalSales = await Product.aggregate([
    { $match: query },
    { $group: { _id: null, total: { $sum: '$price' } } },
    { $project: { total: 1, _id: 0 } },
  ]);

  const categoryData = await Product.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$category',
        value: { $sum: 1 },
      },
    },
    {
      $project: {
        name: '$_id',
        value: 1,
        _id: 0,
      },
    },
  ]);

  return {
    totalSales: totalSales[0]?.total || 0,
    categoryData,
  };
};

// Generate CSV
const generateCSV = (animalData: AnimalData, userData: UserData, productData: ProductData): string => {
  const fields = [
    { label: 'Category', value: 'category' },
    { label: 'Metric', value: 'metric' },
    { label: 'Value', value: 'value' },
  ];
  const data: { category: string; metric: string; value: number | string }[] = [];

  // Summary stats
  data.push({ category: 'Summary', metric: 'Total Animals', value: animalData.totalAnimals });
  data.push({ category: 'Summary', metric: 'Active Users', value: userData.activeUsers });
  data.push({ category: 'Summary', metric: 'Marketplace Sales (DT)', value: productData.totalSales });

  // Animal data
  animalData.animalData.forEach((item) => {
    data.push({ category: 'Animals', metric: `${item.type} Total`, value: item.count });
    data.push({ category: 'Animals', metric: `${item.type} Lost`, value: item.lost });
    data.push({ category: 'Animals', metric: `${item.type} Found`, value: item.found });
  });

  // User engagement data
  userData.engagementData.forEach((item) => {
    data.push({ category: 'User Engagement', metric: `${item.month} Total Users`, value: item.users });
    data.push({ category: 'User Engagement', metric: `${item.month} Active Users`, value: item.active });
  });

  // Provider bookings
  userData.providerBookings.forEach((item) => {
    data.push({ category: 'Provider Bookings', metric: `${item.month} Veterinarians`, value: item.veterinarians });
    data.push({ category: 'Provider Bookings', metric: `${item.month} Trainers`, value: item.trainers });
    data.push({ category: 'Provider Bookings', metric: `${item.month} Groomers`, value: item.groomers });
    data.push({ category: 'Provider Bookings', metric: `${item.month} Shelter`, value: item.shelter });
    data.push({ category: 'Provider Bookings', metric: `${item.month} Surgery`, value: item.surgery });
  });

  // Product categories
  productData.categoryData.forEach((item) => {
    data.push({ category: 'Marketplace', metric: item.name, value: item.value });
  });

  const parser = new Parser({ fields });
  return parser.parse(data);
};

// Generate PDF
const generatePDF = (animalData: AnimalData, userData: UserData, productData: ProductData): Promise<Buffer> => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ 
      margin: 50,
      font: 'Times-Roman' // Use a standard font
    });
    const buffers: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    // Title
    doc.fontSize(20).fillColor('#006D77').text('Statistics Report', { align: 'center' });
    doc.moveDown();

    // Summary Stats
    doc.fontSize(14).text('Summary Statistics', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Total Animals: ${animalData.totalAnimals.toLocaleString()}`);
    doc.text(`Active Users: ${userData.activeUsers.toLocaleString()}`);
    doc.text(`Marketplace Sales: ${productData.totalSales.toLocaleString()} DT`);
    doc.moveDown();

    // Animals by Type
    doc.fontSize(14).text('Animals by Type', { underline: true });
    doc.moveDown(0.5);
    animalData.animalData.forEach((item) => {
      doc.fontSize(12).text(`${item.type}: Total ${item.count}, Lost ${item.lost}, Found ${item.found}`);
    });
    doc.moveDown();

    // User Engagement
    doc.fontSize(14).text('User Engagement Trends', { underline: true });
    doc.moveDown(0.5);
    userData.engagementData.forEach((item) => {
      doc.fontSize(12).text(`${item.month}: Total Users ${item.users}, Active Users ${item.active}`);
    });
    doc.moveDown();

    // Provider Bookings
    doc.fontSize(14).text('Service Provider Bookings', { underline: true });
    doc.moveDown(0.5);
    userData.providerBookings.forEach((item) => {
      doc.fontSize(12).text(
        `${item.month}: Veterinarians ${item.veterinarians}, Trainers ${item.trainers}, ` +
        `Groomers ${item.groomers}, Shelter ${item.shelter}, Surgery ${item.surgery}`
      );
    });
    doc.moveDown();

    // Marketplace Categories
    doc.fontSize(14).text('Marketplace Categories', { underline: true });
    doc.moveDown(0.5);
    productData.categoryData.forEach((item) => {
      doc.fontSize(12).text(`${item.name}: ${item.value}`);
    });

    doc.end();
  });
};

// API Route Handler
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format');
    const days = searchParams.get('days') || '30';
    const userId = request.headers.get('x-user-id') || undefined;

    console.log('Export request received:', { format, days, userId });

    // Validate format
    if (!format || !['csv', 'pdf'].includes(format)) {
      return NextResponse.json({ error: 'Invalid format. Use "csv" or "pdf".' }, { status: 400 });
    }

    // Fetch data
    console.log('Fetching data...');
    const [animalData, userData, productData] = await Promise.all([
      fetchAnimalData(days, userId).catch(error => {
        console.error('Error fetching animal data:', error);
        throw error;
      }),
      fetchUserData(days, userId).catch(error => {
        console.error('Error fetching user data:', error);
        throw error;
      }),
      fetchProductData(days, userId).catch(error => {
        console.error('Error fetching product data:', error);
        throw error;
      }),
    ]);

    console.log('Data fetched successfully');

    if (format === 'csv') {
      console.log('Generating CSV...');
      const csv = generateCSV(animalData, userData, productData);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=statistics.csv',
        },
      });
    } else {
      console.log('Generating PDF...');
      const pdfBuffer = await generatePDF(animalData, userData, productData);
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=statistics.pdf',
        },
      });
    }
  } catch (error: any) {
    console.error('Error in /api/admin/export:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}