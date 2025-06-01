
// app/api/FoundLost/[id]/route.ts
import { connectDB } from '@/lib/db';
import { FoundLost } from '@/models/FoundLost';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const report = await FoundLost.findById(params.id)
    .populate('reporter', 'name email')
    .populate('animal');

  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  return NextResponse.json(report);
}
export async function PUT(req:NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const updates = await req.json();

  const report = await FoundLost.findById(params.id);
  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  // if (report.reporter?.toString() !== user._id.toString()) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  // }

  Object.assign(report, updates);
  await report.save();
  return NextResponse.json(report);
}


// export const DELETE = withAuth(async (req, user, { params }: { params: { id: string } }) => {
//   await connectDB();
//   const report = await FoundLost.findById(params.id);

//   if (!report) {
//     return NextResponse.json({ error: 'Report not found' }, { status: 404 });
//   }

//   if (report.reporter?.toString() !== user._id.toString()) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
//   }

//   await FoundLost.findByIdAndDelete(params.id);
//   return NextResponse.json({ success: true });
// });
