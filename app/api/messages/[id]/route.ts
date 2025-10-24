import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Chat from '@/models/Chat';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// GET - Fetch specific chat by application ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    await dbConnect();

    // Find chat by application ID
    const chat = await Chat.findOne({ applicationId: params.id })
      .populate('participants', 'email profile role candidateProfile recruiterProfile')
      .populate({
        path: 'applicationId',
        populate: {
          path: 'jobId',
          select: 'title company'
        }
      });

    if (!chat) {
      return NextResponse.json({ chat: null, messages: [] });
    }

    // Check if user is a participant
    const isParticipant = chat.participants.some(
      (p: any) => p._id.toString() === decoded.userId
    );

    if (!isParticipant) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Mark messages as read for current user
    let hasUnread = false;
    chat.messages.forEach((msg: any) => {
      if (msg.sender.toString() !== decoded.userId && !msg.read) {
        msg.read = true;
        hasUnread = true;
      }
    });

    if (hasUnread) {
      await chat.save();
    }

    return NextResponse.json({ chat, messages: chat.messages });
  } catch (error: any) {
    console.error('Error fetching chat:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Send message to specific chat
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    await dbConnect();

    const body = await request.json();
    const { message } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    // Find chat by application ID
    let chat = await Chat.findOne({ applicationId: params.id });

    if (!chat) {
      // Get application to find participants
      const Application = (await import('@/models/Application')).default;
      const application = await Application.findById(params.id);
      
      if (!application) {
        return NextResponse.json({ error: 'Application not found' }, { status: 404 });
      }

      // Create new chat with both participants
      chat = await Chat.create({
        participants: [application.candidateId, application.recruiterId],
        applicationId: params.id,
        messages: [],
        lastMessage: {
          content: message,
          createdAt: new Date(),
        },
      });
    }

    // Add message to chat
    chat.messages.push({
      sender: decoded.userId,
      content: message,
      type: 'text',
      read: false,
      createdAt: new Date(),
    });

    chat.lastMessage = {
      content: message,
      createdAt: new Date(),
    };
    chat.updatedAt = new Date();

    await chat.save();

    // Populate and return
    await chat.populate('participants', 'email profile role');

    return NextResponse.json({
      message: 'Message sent successfully',
      chat,
      newMessage: chat.messages[chat.messages.length - 1],
    });
  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message', details: error.message },
      { status: 500 }
    );
  }
}
