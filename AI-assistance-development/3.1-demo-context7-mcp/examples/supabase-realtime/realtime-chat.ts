import { createClient, RealtimeChannel } from '@supabase/supabase-js';

/**
 * Message type as stored in Supabase
 */
export interface Message {
  id: string;
  room_id: string;
  user_id: string;
  text: string;
  created_at: string;
  updated_at: string;
}

/**
 * Event types from Supabase realtime
 */
export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE';

/**
 * Callback function for realtime message events
 */
export type MessageCallback = (event: RealtimeEvent, message: Message) => void;

/**
 * Realtime Chat Manager using Supabase Channels API
 * Handles realtime subscriptions to chat messages in a specific room
 */
export class RealtimeChat {
  private supabaseUrl: string;
  private supabaseKey: string;
  private channel: RealtimeChannel | null = null;
  private roomId: string | null = null;
  private messageCallback: MessageCallback | null = null;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
  }

  /**
   * Initialize Supabase client and set up realtime subscription
   * @param roomId - The chat room ID to subscribe to
   * @param callback - Function called when messages are created/updated/deleted
   */
  async subscribe(roomId: string, callback: MessageCallback): Promise<void> {
    try {
      // Create Supabase client
      const supabase = createClient(this.supabaseUrl, this.supabaseKey);

      this.roomId = roomId;
      this.messageCallback = callback;

      // Create a channel for this room
      this.channel = supabase.channel(`messages:room_id=eq.${roomId}`, {
        config: {
          broadcast: { self: true },
          presence: { key: roomId },
        },
      });

      // Subscribe to all database changes on the messages table
      this.channel
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `room_id=eq.${roomId}`,
          },
          (payload: any) => {
            const message = payload.new as Message;
            this.messageCallback?.('INSERT', message);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'messages',
            filter: `room_id=eq.${roomId}`,
          },
          (payload: any) => {
            const message = payload.new as Message;
            this.messageCallback?.('UPDATE', message);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'messages',
            filter: `room_id=eq.${roomId}`,
          },
          (payload: any) => {
            const message = payload.old as Message;
            this.messageCallback?.('DELETE', message);
          }
        )
        .subscribe((status: string) => {
          if (status === 'CHANNEL_ERROR') {
            console.error(`Failed to subscribe to room ${roomId}`);
          } else if (status === 'SUBSCRIBED') {
            console.log(`Subscribed to room ${roomId}`);
          }
        });
    } catch (error) {
      console.error('Subscription error:', error);
      throw error;
    }
  }

  /**
   * Send a message to the chat room
   * @param roomId - The room to send the message to
   * @param text - The message text
   * @param userId - The user sending the message
   */
  async sendMessage(roomId: string, text: string, userId: string): Promise<Message> {
    try {
      const supabase = createClient(this.supabaseUrl, this.supabaseKey);

      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from('messages')
        .insert({
          room_id: roomId,
          user_id: userId,
          text: text,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as Message;
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }

  /**
   * Fetch message history for a room
   * @param roomId - The room to fetch messages from
   * @param limit - Maximum number of messages to fetch
   */
  async getHistory(roomId: string, limit: number = 50): Promise<Message[]> {
    try {
      const supabase = createClient(this.supabaseUrl, this.supabaseKey);

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return (data as Message[]).reverse(); // Reverse to get chronological order
    } catch (error) {
      console.error('Get history error:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe from the realtime channel
   */
  async unsubscribe(): Promise<void> {
    if (this.channel) {
      try {
        const supabase = createClient(this.supabaseUrl, this.supabaseKey);
        await supabase.removeChannel(this.channel);
        this.channel = null;
        this.roomId = null;
        this.messageCallback = null;
        console.log('Unsubscribed from realtime messages');
      } catch (error) {
        console.error('Unsubscribe error:', error);
        throw error;
      }
    }
  }

  /**
   * Check if currently subscribed to a room
   */
  isSubscribed(): boolean {
    return this.channel !== null && this.roomId !== null;
  }

  /**
   * Get the current room ID
   */
  getCurrentRoomId(): string | null {
    return this.roomId;
  }
}

/**
 * Example usage
 */
export async function exampleUsage() {
  const chat = new RealtimeChat(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_KEY || ''
  );

  try {
    // Subscribe to room
    await chat.subscribe('room-123', (event, message) => {
      console.log(`[${event}] ${message.user_id}: ${message.text}`);
    });

    // Send a message
    const newMessage = await chat.sendMessage(
      'room-123',
      'Hello, world!',
      'user-456'
    );
    console.log('Sent message:', newMessage);

    // Get history
    const history = await chat.getHistory('room-123', 10);
    console.log('Message history:', history);

    // Keep subscription alive
    await new Promise((resolve) => setTimeout(resolve, 30000));

    // Clean up
    await chat.unsubscribe();
  } catch (error) {
    console.error('Error in example usage:', error);
  }
}
