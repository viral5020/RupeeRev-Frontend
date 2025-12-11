import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Fab,
  Drawer,
  Typography,
  TextField,
  IconButton,
  Paper,
  Stack,
  Chip,
  InputAdornment,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import faqData from '../../data/faqPreset.json';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatbotWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m your financial assistant. Ask me anything about investments, savings, or financial planning. Try: "How much should I invest monthly?"',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findAnswer = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // Exact match
    const exactMatch = faqData.find((faq) => faq.question.toLowerCase() === lowerQuery);
    if (exactMatch) return exactMatch.answer;

    // Keyword matching
    const keywords = lowerQuery.split(' ');
    let bestMatch = faqData[0];
    let maxScore = 0;

    faqData.forEach((faq) => {
      const faqLower = faq.question.toLowerCase();
      const answerLower = faq.answer.toLowerCase();
      let score = 0;

      keywords.forEach((keyword) => {
        if (faqLower.includes(keyword)) score += 2;
        if (answerLower.includes(keyword)) score += 1;
      });

      if (score > maxScore) {
        maxScore = score;
        bestMatch = faq;
      }
    });

    if (maxScore > 0) return bestMatch.answer;

    // Fallback
    return "I understand you're asking about: " + query + ". Here's a general answer: Please check the FAQ section or use the search feature. For specific calculations, use the Goals or Investments pages.";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate thinking delay
    setTimeout(() => {
      const answer = findAnswer(input);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: answer,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
        }}
      >
        <ChatIcon />
      </Fab>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 }, p: 0 },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              💬 Financial Assistant
            </Typography>
            <IconButton onClick={() => setOpen(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 2,
              bgcolor: '#f5f5f5',
            }}
          >
            <Stack spacing={2}>
              {messages.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    display: 'flex',
                    justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Paper
                    sx={{
                      p: 1.5,
                      maxWidth: '80%',
                      bgcolor: msg.isUser ? 'primary.main' : 'white',
                      color: msg.isUser ? 'white' : 'text.primary',
                    }}
                  >
                    <Typography variant="body2">{msg.text}</Typography>
                  </Paper>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Stack>
          </Box>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <Box sx={{ p: 2, bgcolor: '#fafafa', borderTop: '1px solid #e0e0e0' }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Quick Questions:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {faqData.slice(0, 5).map((faq) => (
                  <Chip
                    key={faq.id}
                    label={faq.question}
                    size="small"
                    onClick={() => handleQuickQuestion(faq.question)}
                    sx={{ mb: 1, cursor: 'pointer' }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Input */}
          <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', bgcolor: 'white' }}>
            <TextField
              fullWidth
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSend} color="primary">
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default ChatbotWidget;

