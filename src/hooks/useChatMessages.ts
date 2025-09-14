import { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '../types';
import { getChatMessages, sendMessage } from '../services/chatService';

export const useChatMessages = (chatId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    if (!chatId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const chatMessages = await getChatMessages(chatId);
      setMessages(chatMessages);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Error al cargar los mensajes');
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  const sendNewMessage = useCallback(async (
    senderId: string, 
    content: string, 
    type: 'text' | 'quotation' | 'file' = 'text',
    quotation?: any
  ) => {
    if (!chatId || !content.trim()) return null;

    try {
      const newMessage = await sendMessage(chatId, senderId, content, type, quotation);
      
      // Actualizar la lista de mensajes inmediatamente
      setMessages(prev => [...prev, newMessage]);
      
      // Recargar mensajes después de un breve delay para asegurar persistencia
      setTimeout(() => {
        loadMessages();
      }, 200);
      
      console.log('Mensaje enviado y chat guardado automáticamente');
      return newMessage;
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Error al enviar el mensaje');
      return null;
    }
  }, [chatId, loadMessages]);

  const refreshMessages = useCallback(() => {
    loadMessages();
  }, [loadMessages]);

  // Cargar mensajes cuando cambie el chatId
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return {
    messages,
    loading,
    error,
    sendMessage: sendNewMessage,
    refreshMessages,
    loadMessages,
  };
};
