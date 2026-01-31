import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useChatbot } from '../contexts/ChatbotContext';
import { Button } from './ui/button';

const Chatbot = () => {
  const { isOpen, messages, toggleChatbot, sendMessage } = useChatbot();
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={toggleChatbot}
          className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all duration-300 hover:scale-110 z-50"
          data-testid="chatbot-toggle"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-8 right-8 w-96 h-[500px] bg-background border border-border shadow-2xl flex flex-col z-50" data-testid="chatbot-widget">
          <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium text-sm uppercase tracking-widest">Chat Support</span>
            </div>
            <button onClick={toggleChatbot} data-testid="chatbot-close">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 text-sm ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                  data-testid={`chatbot-message-${message.sender}`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-border">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 h-10 px-3 border border-border bg-transparent text-sm focus:outline-none focus:border-primary transition-colors"
                data-testid="chatbot-input"
              />
              <Button type="submit" size="sm" className="rounded-none h-10 px-4" data-testid="chatbot-send">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;