// ============================================================
// GHG Shield — Parse Invoice API Endpoint
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { parseUtilityBill } from '@/lib/claude';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp']; // Claude vision supports images. If PDF, we'd need a pdf-to-image step or use Claude's new PDF beta
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Please upload an image (JPG, PNG, WEBP). PDF parsing coming soon.' },
                { status: 400 }
            );
        }

        // Convert file to Base64
        const buffer = await file.arrayBuffer();
        const base64Data = Buffer.from(buffer).toString('base64');

        // Parse with Claude Vision
        const extractedData = await parseUtilityBill(base64Data, file.type);

        return NextResponse.json(extractedData);
    } catch (error) {
        console.error('Invoice parsing error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to parse invoice' },
            { status: 500 }
        );
    }
}
