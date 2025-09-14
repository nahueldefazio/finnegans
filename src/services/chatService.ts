import { Chat, ChatMessage, Quotation } from '../types/index';
import { dataPersistenceService } from './dataPersistenceService';

export const getChatsByUserId = async (userId: string): Promise<Chat[]> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return dataPersistenceService.chats.getChatsByUserId(userId);
};

export const getChatById = async (chatId: string): Promise<Chat | null> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return dataPersistenceService.chats.getChatById(chatId);
};

export const getChatMessages = async (chatId: string): Promise<ChatMessage[]> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return dataPersistenceService.messages.getMessagesByChatId(chatId);
};

export const sendMessage = async (
  chatId: string,
  senderId: string,
  content: string,
  type: 'text' | 'quotation' | 'file' = 'text',
  quotation?: Quotation
): Promise<ChatMessage> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Verificar que el chat existe, si no existe, crearlo
  let chat = dataPersistenceService.chats.getChatById(chatId);
  if (!chat) {
    console.log('Chat no existe, creando chat automáticamente...');
    // Si el chat no existe, crear uno básico
    chat = dataPersistenceService.chats.createChat({
      pymeId: senderId, // Asumir que el sender es la PyME
      proveedorId: 'unknown', // Se actualizará cuando se sepa el proveedor
      matchId: chatId, // Usar chatId como matchId temporal
    });
    console.log('Chat creado automáticamente:', chat.id);
  }
  
  const newMessage = dataPersistenceService.messages.createMessage({
    chatId,
    senderId,
    content,
    type,
    quotation,
  });

  return newMessage;
};

export const createChat = async (
  pymeId: string,
  proveedorId: string,
  matchId: string
): Promise<Chat> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Verificar si ya existe un chat con este matchId para evitar duplicados
  const existingChats = dataPersistenceService.chats.getChatsByUserId(pymeId);
  const existingChat = existingChats.find(chat => chat.matchId === matchId);
  
  if (existingChat) {
    console.log('Chat ya existe para este matchId, retornando chat existente');
    return existingChat;
  }
  
  // Crear el chat
  const newChat = dataPersistenceService.chats.createChat({
    pymeId,
    proveedorId,
    matchId,
  });

  // Agregar un mensaje inicial de bienvenida personalizado
  const welcomeMessage = dataPersistenceService.messages.createMessage({
    chatId: newChat.id,
    senderId: 'system',
    content: `¡Hola! Has iniciado una conversación con este proveedor. Esta conversación se ha guardado automáticamente y estará disponible en tu lista de chats. ¿En qué puedo ayudarte?`,
    type: 'text',
  });

  // Actualizar el chat con el mensaje inicial
  dataPersistenceService.chats.updateChat(newChat.id, {
    lastMessage: welcomeMessage,
    updatedAt: new Date().toISOString(),
  });

  return newChat;
};

export const respondToQuotation = async (
  quotationId: string,
  status: 'accepted' | 'rejected'
): Promise<void> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Buscar el mensaje con la cotización
  const messages = dataPersistenceService.messages.getAllMessages();
  const message = messages.find(m => m.quotation?.id === quotationId);
  
  if (message && message.quotation) {
    const updatedMessage = {
      ...message,
      quotation: {
        ...message.quotation,
        status,
      },
    };
    
    dataPersistenceService.messages.updateMessage(message.id, updatedMessage);
  }
};

export const closeChat = async (
  chatId: string,
  reason: string,
  comment: string
): Promise<void> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Actualizar el chat con el estado de cerrado
  dataPersistenceService.chats.updateChat(chatId, {
    status: 'closed',
    closedAt: new Date().toISOString(),
    closeReason: reason,
    closeComment: comment,
    updatedAt: new Date().toISOString(),
  });
};

export const deleteChat = async (chatId: string): Promise<void> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Eliminar el chat y todos sus mensajes
  dataPersistenceService.chats.deleteChat(chatId);
  
  // Eliminar todos los mensajes del chat
  const messages = dataPersistenceService.messages.getAllMessages();
  const chatMessages = messages.filter(m => m.chatId === chatId);
  chatMessages.forEach(message => {
    dataPersistenceService.messages.deleteMessage(message.id);
  });
};

