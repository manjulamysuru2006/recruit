import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Chat from '@/models/Chat';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// GET - Fetch all chats for the current user
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    await dbConnect();

    // Find all chats where user is a participant
    const chats = await Chat.find({ participants: decoded.userId })
      .populate('participants', 'email profile role')
      .populate('applicationId', 'jobId status')
      .populate({
        path: 'applicationId',
        populate: {
          path: 'jobId',
          select: 'title company'
        }
      })
      .sort({ updatedAt: -1 });

    return NextResponse.json({ chats });
  } catch (error: any) {
    console.error('Error fetching chats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chats', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new chat or send a message
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    await dbConnect();

    const body = await request.json();
    const { applicationId, recipientId, message } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    // Find or create chat
    let chat = await Chat.findOne({ applicationId });

    if (!chat) {
      // Create new chat
      chat = await Chat.create({
        participants: [decoded.userId, recipientId],
        applicationId,
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

    // Populate the chat before returning
    await chat.populate('participants', 'email profile role');
    await chat.populate('applicationId');

    return NextResponse.json({
      message: 'Message sent successfully',
      chat,
    });
  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message', details: error.message },
      { status: 500 }
    );
  }
}

