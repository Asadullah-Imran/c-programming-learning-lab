// ==============================================================================
// ICS C Programming Learning Lab — API: Student Progress Endpoint
// ==============================================================================

import { NextResponse } from 'next/server';
import { calculateDashboardStats, DEFAULT_DEMO_USER, DEFAULT_SEED_PROGRESS } from '@/lib/db/supabase';

export async function GET() {
  try {
    const stats = calculateDashboardStats();
    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch progress stats',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topicId, lessonId, quizScore, quizMaxScore } = body;

    if (!topicId || !lessonId) {
      return NextResponse.json(
        { success: false, error: 'topicId and lessonId are required.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Progress recorded successfully',
      progress: {
        lessonId,
        topicId,
        quizScore: quizScore || 0,
        quizMaxScore: quizMaxScore || 0,
        completedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save progress' },
      { status: 500 }
    );
  }
}
