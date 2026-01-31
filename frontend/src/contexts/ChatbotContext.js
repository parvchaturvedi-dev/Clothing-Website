import React, { createContext, useState, useContext } from 'react';

const ChatbotContext = createContext(null);

export const ChatbotProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I assist you today?', sender: 'bot' }
  ]);

  const toggleChatbot = () => setIsOpen(!isOpen);
  const closeChatbot = () => setIsOpen(false);
  const openChatbot = () => setIsOpen(true);

  const sendMessage = (text) => {
    const userMessage = {
      id: Date.now(),
      text,
      sender: 'user'
    };
    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const botResponse = generateResponse(text);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot'
      }]);
    }, 500);
  };

  const generateResponse = (userText) => {
    const lowerText = userText.toLowerCase();
    
    if (lowerText.includes('size') || lowerText.includes('sizing')) {
      return 'We offer sizes XS, S, M, L, and XL. Each product page has detailed size information. You can also contact us for personalized sizing advice.';
    } else if (lowerText.includes('available') || lowerText.includes('stock')) {
      return 'You can check product availability on each product page. Available items are marked with a green indicator.';
    } else if (lowerText.includes('order') || lowerText.includes('buy')) {
      return 'To place an order, browse our products, add items to your cart, and submit an enquiry. Our team will contact you to complete your order.';
    } else if (lowerText.includes('contact') || lowerText.includes('help')) {
      return 'You can reach us through the Contact page or by submitting an enquiry for any product. We\'re here to help!';
    } else if (lowerText.includes('delivery') || lowerText.includes('shipping')) {
      return 'Delivery details will be discussed when you submit an enquiry. Our team will provide you with shipping options and timelines.';
    } else if (lowerText.includes('return') || lowerText.includes('exchange')) {
      return 'We have a flexible return and exchange policy. Please contact us through the enquiry form for specific return requests.';
    } else if (lowerText.includes('collection')) {
      return 'Browse our latest collections in the Collections page. Each collection features carefully curated pieces for different occasions.';
    } else {
      return 'Thank you for your question. For specific inquiries, please use our contact form or submit a product enquiry, and our team will get back to you shortly.';
    }
  };

  return (
    <ChatbotContext.Provider value={{ isOpen, messages, toggleChatbot, closeChatbot, openChatbot, sendMessage }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};