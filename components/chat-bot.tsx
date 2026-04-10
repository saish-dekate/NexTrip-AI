'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Mic, MicOff, Loader2, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  onSendMessage: (message: string) => Promise<string>;
  isLoading?: boolean;
  className?: string;
}

export function ChatBot({ onSendMessage, isLoading = false, className }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI travel assistant. Tell me about your dream trip - where do you want to go, and what kind of experience are you looking for?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || localLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLocalLoading(true);

    try {
      const response = await onSendMessage(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      if (isListening) {
        recognition.stop();
        setIsListening(false);
      } else {
        recognition.start();
        setIsListening(true);

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      }
    }
  };

  return (
    <Card className={cn('flex flex-col h-[500px] backdrop-blur-sm bg-white/80 dark:bg-gray-900/80', className)}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cn('flex items-start space-x-3', message.role === 'user' && 'flex-row-reverse space-x-reverse')}
            >
              <div
                className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                  message.role === 'assistant' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                )}
              >
                {message.role === 'assistant' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>
              <div
                className={cn(
                  'flex-1 px-4 py-2 rounded-lg text-sm',
                  message.role === 'assistant'
                    ? 'bg-gray-100 dark:bg-gray-800'
                    : 'bg-primary text-primary-foreground'
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-50 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {(localLoading || isLoading) && (
          <div className="flex items-center space-x-3">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t p-4 flex items-center space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your trip..."
          className="flex-1"
          disabled={localLoading}
        />
        <Button type="submit" size="icon" disabled={!input.trim() || localLoading}>
          <Send className="h-4 w-4" />
        </Button>
        <Button type="button" size="icon" variant="outline" onClick={toggleVoiceInput}>
          {isListening ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
        </Button>
      </form>
    </Card>
  );
}
