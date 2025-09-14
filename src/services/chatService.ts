import { Chat, ChatMessage, Quotation } from '../types/index';
import { dataPersistenceService } from './dataPersistenceService';
import { createBusiness, updateBusinessStatus } from './businessService';

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
    
    // Crear negocio automáticamente cuando se crea un chat
    try {
      await createBusiness(
        chat.id,
        senderId,
        'unknown',
        `quote_${chat.id}`,
        0, // Monto inicial 0, se actualizará cuando se envíe cotización
        'USD'
      );
      console.log('Negocio creado automáticamente para el chat:', chat.id);
    } catch (error) {
      console.error('Error al crear negocio automáticamente:', error);
    }
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

  // Crear negocio automáticamente cuando se crea un chat
  try {
    await createBusiness(
      newChat.id,
      pymeId,
      proveedorId,
      `quote_${newChat.id}`,
      0, // Monto inicial 0, se actualizará cuando se envíe cotización
      'USD'
    );
    console.log('Negocio creado automáticamente para el chat:', newChat.id);
  } catch (error) {
    console.error('Error al crear negocio automáticamente:', error);
  }

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

  // Actualizar el negocio asociado a estado "completed"
  try {
    const chat = dataPersistenceService.chats.getChatById(chatId);
    if (chat) {
      // Buscar el negocio asociado al chat
      const allBusinesses = dataPersistenceService.businesses.getAllBusinesses();
      const business = allBusinesses.find(b => b.chatId === chatId);
      
      if (business) {
        await updateBusinessStatus(business.id, 'completed', new Date().toISOString());
        console.log('Negocio marcado como completado al cerrar el chat:', business.id);
      }
    }
  } catch (error) {
    console.error('Error al actualizar negocio al cerrar chat:', error);
  }
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

