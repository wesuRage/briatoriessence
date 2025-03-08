import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp },
      process.env.CLOUDINARY_API_SECRET as string
    );

    return NextResponse.json({
      timestamp,
      signature,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
      apiKey: process.env.CLOUDINARY_API_KEY as string,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao gerar assinatura' }, { status: 500 });
  }
}
