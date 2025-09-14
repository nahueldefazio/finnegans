// Servicio de persistencia de datos local
// Simula un backend completo con almacenamiento local

import { 
  Chat, 
  ChatMessage, 
  Business, 
  Review, 
  PyMEProfile, 
  ProveedorProfile, 
  Match,
  User 
} from '../types/index';

// Claves para localStorage
const STORAGE_KEYS = {
  CHATS: 'pyme_connect_chats',
  CHAT_MESSAGES: 'pyme_connect_chat_messages',
  BUSINESSES: 'pyme_connect_businesses',
  REVIEWS: 'pyme_connect_reviews',
  PYME_PROFILES: 'pyme_connect_pyme_profiles',
  PROVEEDOR_PROFILES: 'pyme_connect_proveedor_profiles',
  MATCHES: 'pyme_connect_matches',
  USERS: 'pyme_connect_users',
} as const;

// Utilidades para localStorage
const storageUtils = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage for key ${key}:`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage for key ${key}:`, error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage for key ${key}:`, error);
    }
  }
};

// Servicio de persistencia de Chats
export const chatPersistenceService = {
  // Obtener todos los chats
  getAllChats: (): Chat[] => {
    return storageUtils.get(STORAGE_KEYS.CHATS, []);
  },

  // Obtener chat por ID
  getChatById: (chatId: string): Chat | null => {
    const chats = chatPersistenceService.getAllChats();
    return chats.find(chat => chat.id === chatId) || null;
  },

  // Obtener chats por usuario
  getChatsByUserId: (userId: string): Chat[] => {
    const chats = chatPersistenceService.getAllChats();
    return chats.filter(chat => chat.pymeId === userId || chat.proveedorId === userId);
  },

  // Crear nuevo chat
  createChat: (chat: Omit<Chat, 'id' | 'createdAt' | 'updatedAt'>): Chat => {
    const chats = chatPersistenceService.getAllChats();
    const newChat: Chat = {
      ...chat,
      id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    chats.push(newChat);
    storageUtils.set(STORAGE_KEYS.CHATS, chats);
    
    // Emitir evento personalizado para notificar que se creó un chat
    window.dispatchEvent(new CustomEvent('chatCreated', { 
      detail: { chat: newChat } 
    }));
    
    return newChat;
  },

  // Actualizar chat
  updateChat: (chatId: string, updates: Partial<Chat>): Chat | null => {
    const chats = chatPersistenceService.getAllChats();
    const chatIndex = chats.findIndex(chat => chat.id === chatId);
    
    if (chatIndex === -1) return null;
    
    chats[chatIndex] = {
      ...chats[chatIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    storageUtils.set(STORAGE_KEYS.CHATS, chats);
    return chats[chatIndex];
  },

  // Eliminar chat
  deleteChat: (chatId: string): boolean => {
    const chats = chatPersistenceService.getAllChats();
    const filteredChats = chats.filter(chat => chat.id !== chatId);
    
    if (filteredChats.length === chats.length) return false;
    
    storageUtils.set(STORAGE_KEYS.CHATS, filteredChats);
    return true;
  }
};

// Servicio de persistencia de Mensajes de Chat
export const messagePersistenceService = {
  // Obtener todos los mensajes
  getAllMessages: (): ChatMessage[] => {
    return storageUtils.get(STORAGE_KEYS.CHAT_MESSAGES, []);
  },

  // Obtener mensajes por chat
  getMessagesByChatId: (chatId: string): ChatMessage[] => {
    const messages = messagePersistenceService.getAllMessages();
    return messages.filter(message => message.chatId === chatId);
  },

  // Crear nuevo mensaje
  createMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage => {
    const messages = messagePersistenceService.getAllMessages();
    const newMessage: ChatMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    
    messages.push(newMessage);
    storageUtils.set(STORAGE_KEYS.CHAT_MESSAGES, messages);
    
    // Actualizar el chat con el último mensaje
    chatPersistenceService.updateChat(message.chatId, {
      lastMessage: newMessage,
      updatedAt: new Date().toISOString(),
    });
    
    // Emitir evento personalizado para notificar que se creó un mensaje
    window.dispatchEvent(new CustomEvent('chatMessageCreated', { 
      detail: { chatId: message.chatId, message: newMessage } 
    }));
    
    return newMessage;
  },

  // Actualizar mensaje
  updateMessage: (messageId: string, updates: Partial<ChatMessage>): ChatMessage | null => {
    const messages = messagePersistenceService.getAllMessages();
    const messageIndex = messages.findIndex(message => message.id === messageId);
    
    if (messageIndex === -1) return null;
    
    messages[messageIndex] = {
      ...messages[messageIndex],
      ...updates,
    };
    
    storageUtils.set(STORAGE_KEYS.CHAT_MESSAGES, messages);
    return messages[messageIndex];
  },

  // Eliminar mensaje
  deleteMessage: (messageId: string): boolean => {
    const messages = messagePersistenceService.getAllMessages();
    const filteredMessages = messages.filter(message => message.id !== messageId);
    
    if (filteredMessages.length === messages.length) return false;
    
    storageUtils.set(STORAGE_KEYS.CHAT_MESSAGES, filteredMessages);
    return true;
  }
};

// Servicio de persistencia de Negocios
export const businessPersistenceService = {
  // Obtener todos los negocios
  getAllBusinesses: (): Business[] => {
    return storageUtils.get(STORAGE_KEYS.BUSINESSES, []);
  },

  // Obtener negocio por ID
  getBusinessById: (businessId: string): Business | null => {
    const businesses = businessPersistenceService.getAllBusinesses();
    return businesses.find(business => business.id === businessId) || null;
  },

  // Obtener negocios por usuario
  getBusinessesByUserId: (userId: string): Business[] => {
    const businesses = businessPersistenceService.getAllBusinesses();
    return businesses.filter(business => business.pymeId === userId || business.proveedorId === userId);
  },

  // Crear nuevo negocio
  createBusiness: (business: Omit<Business, 'id' | 'createdAt'>): Business => {
    const businesses = businessPersistenceService.getAllBusinesses();
    const newBusiness: Business = {
      ...business,
      id: `business_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    businesses.push(newBusiness);
    storageUtils.set(STORAGE_KEYS.BUSINESSES, businesses);
    return newBusiness;
  },

  // Actualizar negocio
  updateBusiness: (businessId: string, updates: Partial<Business>): Business | null => {
    const businesses = businessPersistenceService.getAllBusinesses();
    const businessIndex = businesses.findIndex(business => business.id === businessId);
    
    if (businessIndex === -1) return null;
    
    businesses[businessIndex] = {
      ...businesses[businessIndex],
      ...updates,
    };
    
    storageUtils.set(STORAGE_KEYS.BUSINESSES, businesses);
    return businesses[businessIndex];
  },

  // Eliminar negocio
  deleteBusiness: (businessId: string): boolean => {
    const businesses = businessPersistenceService.getAllBusinesses();
    const filteredBusinesses = businesses.filter(business => business.id !== businessId);
    
    if (filteredBusinesses.length === businesses.length) return false;
    
    storageUtils.set(STORAGE_KEYS.BUSINESSES, filteredBusinesses);
    return true;
  }
};

// Servicio de persistencia de Reseñas
export const reviewPersistenceService = {
  // Obtener todas las reseñas
  getAllReviews: (): Review[] => {
    return storageUtils.get(STORAGE_KEYS.REVIEWS, []);
  },

  // Obtener reseña por ID
  getReviewById: (reviewId: string): Review | null => {
    const reviews = reviewPersistenceService.getAllReviews();
    return reviews.find(review => review.id === reviewId) || null;
  },

  // Obtener reseñas por usuario
  getReviewsByUserId: (userId: string): Review[] => {
    const reviews = reviewPersistenceService.getAllReviews();
    return reviews.filter(review => review.fromUserId === userId || review.toUserId === userId);
  },

  // Crear nueva reseña
  createReview: (review: Omit<Review, 'id' | 'createdAt'>): Review => {
    const reviews = reviewPersistenceService.getAllReviews();
    const newReview: Review = {
      ...review,
      id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    reviews.push(newReview);
    storageUtils.set(STORAGE_KEYS.REVIEWS, reviews);
    return newReview;
  },

  // Actualizar reseña
  updateReview: (reviewId: string, updates: Partial<Review>): Review | null => {
    const reviews = reviewPersistenceService.getAllReviews();
    const reviewIndex = reviews.findIndex(review => review.id === reviewId);
    
    if (reviewIndex === -1) return null;
    
    reviews[reviewIndex] = {
      ...reviews[reviewIndex],
      ...updates,
    };
    
    storageUtils.set(STORAGE_KEYS.REVIEWS, reviews);
    return reviews[reviewIndex];
  },

  // Eliminar reseña
  deleteReview: (reviewId: string): boolean => {
    const reviews = reviewPersistenceService.getAllReviews();
    const filteredReviews = reviews.filter(review => review.id !== reviewId);
    
    if (filteredReviews.length === reviews.length) return false;
    
    storageUtils.set(STORAGE_KEYS.REVIEWS, filteredReviews);
    return true;
  }
};

// Servicio de persistencia de Perfiles PyME
export const pymeProfilePersistenceService = {
  // Obtener todos los perfiles PyME
  getAllProfiles: (): PyMEProfile[] => {
    return storageUtils.get(STORAGE_KEYS.PYME_PROFILES, []);
  },

  // Obtener perfil por ID
  getProfileById: (profileId: string): PyMEProfile | null => {
    const profiles = pymeProfilePersistenceService.getAllProfiles();
    return profiles.find(profile => profile.id === profileId) || null;
  },

  // Obtener perfil por usuario
  getProfileByUserId: (userId: string): PyMEProfile | null => {
    const profiles = pymeProfilePersistenceService.getAllProfiles();
    return profiles.find(profile => profile.userId === userId) || null;
  },

  // Crear o actualizar perfil
  saveProfile: (profile: PyMEProfile): PyMEProfile => {
    const profiles = pymeProfilePersistenceService.getAllProfiles();
    const existingIndex = profiles.findIndex(p => p.id === profile.id);
    
    if (existingIndex >= 0) {
      profiles[existingIndex] = profile;
    } else {
      profiles.push(profile);
    }
    
    storageUtils.set(STORAGE_KEYS.PYME_PROFILES, profiles);
    return profile;
  },

  // Eliminar perfil
  deleteProfile: (profileId: string): boolean => {
    const profiles = pymeProfilePersistenceService.getAllProfiles();
    const filteredProfiles = profiles.filter(profile => profile.id !== profileId);
    
    if (filteredProfiles.length === profiles.length) return false;
    
    storageUtils.set(STORAGE_KEYS.PYME_PROFILES, filteredProfiles);
    return true;
  }
};

// Servicio de persistencia de Perfiles Proveedor
export const proveedorProfilePersistenceService = {
  // Obtener todos los perfiles proveedor
  getAllProfiles: (): ProveedorProfile[] => {
    return storageUtils.get(STORAGE_KEYS.PROVEEDOR_PROFILES, []);
  },

  // Obtener perfil por ID
  getProfileById: (profileId: string): ProveedorProfile | null => {
    const profiles = proveedorProfilePersistenceService.getAllProfiles();
    return profiles.find(profile => profile.id === profileId) || null;
  },

  // Obtener perfil por usuario
  getProfileByUserId: (userId: string): ProveedorProfile | null => {
    const profiles = proveedorProfilePersistenceService.getAllProfiles();
    return profiles.find(profile => profile.userId === userId) || null;
  },

  // Crear o actualizar perfil
  saveProfile: (profile: ProveedorProfile): ProveedorProfile => {
    const profiles = proveedorProfilePersistenceService.getAllProfiles();
    const existingIndex = profiles.findIndex(p => p.id === profile.id);
    
    if (existingIndex >= 0) {
      profiles[existingIndex] = profile;
    } else {
      profiles.push(profile);
    }
    
    storageUtils.set(STORAGE_KEYS.PROVEEDOR_PROFILES, profiles);
    return profile;
  },

  // Eliminar perfil
  deleteProfile: (profileId: string): boolean => {
    const profiles = proveedorProfilePersistenceService.getAllProfiles();
    const filteredProfiles = profiles.filter(profile => profile.id !== profileId);
    
    if (filteredProfiles.length === profiles.length) return false;
    
    storageUtils.set(STORAGE_KEYS.PROVEEDOR_PROFILES, filteredProfiles);
    return true;
  }
};

// Servicio de persistencia de Matches
export const matchPersistenceService = {
  // Obtener todos los matches
  getAllMatches: (): Match[] => {
    return storageUtils.get(STORAGE_KEYS.MATCHES, []);
  },

  // Obtener match por ID
  getMatchById: (matchId: string): Match | null => {
    const matches = matchPersistenceService.getAllMatches();
    return matches.find(match => match.id === matchId) || null;
  },

  // Obtener matches por PyME
  getMatchesByPymeId: (pymeId: string): Match[] => {
    const matches = matchPersistenceService.getAllMatches();
    return matches.filter(match => match.pymeId === pymeId);
  },

  // Obtener matches por Proveedor
  getMatchesByProveedorId: (proveedorId: string): Match[] => {
    const matches = matchPersistenceService.getAllMatches();
    return matches.filter(match => match.proveedorId === proveedorId);
  },

  // Crear nuevo match
  createMatch: (match: Omit<Match, 'id' | 'createdAt'>): Match => {
    const matches = matchPersistenceService.getAllMatches();
    const newMatch: Match = {
      ...match,
      id: `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    matches.push(newMatch);
    storageUtils.set(STORAGE_KEYS.MATCHES, matches);
    return newMatch;
  },

  // Actualizar match
  updateMatch: (matchId: string, updates: Partial<Match>): Match | null => {
    const matches = matchPersistenceService.getAllMatches();
    const matchIndex = matches.findIndex(match => match.id === matchId);
    
    if (matchIndex === -1) return null;
    
    matches[matchIndex] = {
      ...matches[matchIndex],
      ...updates,
    };
    
    storageUtils.set(STORAGE_KEYS.MATCHES, matches);
    return matches[matchIndex];
  },

  // Eliminar match
  deleteMatch: (matchId: string): boolean => {
    const matches = matchPersistenceService.getAllMatches();
    const filteredMatches = matches.filter(match => match.id !== matchId);
    
    if (filteredMatches.length === matches.length) return false;
    
    storageUtils.set(STORAGE_KEYS.MATCHES, filteredMatches);
    return true;
  }
};

// Servicio de persistencia de Usuarios
export const userPersistenceService = {
  // Obtener todos los usuarios
  getAllUsers: (): User[] => {
    return storageUtils.get(STORAGE_KEYS.USERS, []);
  },

  // Obtener usuario por ID
  getUserById: (userId: string): User | null => {
    const users = userPersistenceService.getAllUsers();
    return users.find(user => user.id === userId) || null;
  },

  // Obtener usuario por email
  getUserByEmail: (email: string): User | null => {
    const users = userPersistenceService.getAllUsers();
    return users.find(user => user.email === email) || null;
  },

  // Crear nuevo usuario
  createUser: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
    const users = userPersistenceService.getAllUsers();
    const newUser: User = {
      ...user,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    storageUtils.set(STORAGE_KEYS.USERS, users);
    return newUser;
  },

  // Actualizar usuario
  updateUser: (userId: string, updates: Partial<User>): User | null => {
    const users = userPersistenceService.getAllUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) return null;
    
    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    storageUtils.set(STORAGE_KEYS.USERS, users);
    return users[userIndex];
  },

  // Eliminar usuario
  deleteUser: (userId: string): boolean => {
    const users = userPersistenceService.getAllUsers();
    const filteredUsers = users.filter(user => user.id !== userId);
    
    if (filteredUsers.length === users.length) return false;
    
    storageUtils.set(STORAGE_KEYS.USERS, filteredUsers);
    return true;
  }
};

// Servicio de limpieza de datos
export const dataCleanupService = {
  // Limpiar todos los datos
  clearAllData: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      storageUtils.remove(key);
    });
  },

  // Limpiar datos específicos
  clearDataByType: (type: keyof typeof STORAGE_KEYS): void => {
    storageUtils.remove(STORAGE_KEYS[type]);
  },

  // Exportar todos los datos
  exportAllData: (): Record<string, any> => {
    const data: Record<string, any> = {};
    Object.entries(STORAGE_KEYS).forEach(([type, key]) => {
      data[type] = storageUtils.get(key, []);
    });
    return data;
  },

  // Importar datos
  importData: (data: Record<string, any>): void => {
    Object.entries(data).forEach(([type, value]) => {
      if (STORAGE_KEYS[type as keyof typeof STORAGE_KEYS]) {
        storageUtils.set(STORAGE_KEYS[type as keyof typeof STORAGE_KEYS], value);
      }
    });
  }
};

// Servicio principal de persistencia
export const dataPersistenceService = {
  chats: chatPersistenceService,
  messages: messagePersistenceService,
  businesses: businessPersistenceService,
  reviews: reviewPersistenceService,
  pymeProfiles: pymeProfilePersistenceService,
  proveedorProfiles: proveedorProfilePersistenceService,
  matches: matchPersistenceService,
  users: userPersistenceService,
  cleanup: dataCleanupService,
};

export default dataPersistenceService;
