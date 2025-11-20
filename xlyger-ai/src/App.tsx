import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  Volume2, 
  Globe, 
  Brain, 
  Mic2, 
  Image, 
  FileText,
  Copy,
  MessageSquare
} from 'lucide-react';
import './App.css';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  mode: string;
}

interface AIMode {
  id: string;
  name: string;
  color: string;
  icon: React.ReactNode;
  description: string;
}

const AI_MODES: AIMode[] = [
  {
    id: 'general',
    name: 'General AI',
    color: '#E91E63',
    icon: <Brain className="w-5 h-5" />,
    description: 'Your smart assistant for general questions and conversations'
  },
  {
    id: 'voice',
    name: 'Voice Processing',
    color: '#2196F3',
    icon: <Mic2 className="w-5 h-5" />,
    description: 'Advanced voice recognition and audio processing capabilities'
  },
  {
    id: 'image',
    name: 'Image Processing',
    color: '#4CAF50',
    icon: <Image className="w-5 h-5" />,
    description: 'Analyze, understand, and process images and visual content'
  },
  {
    id: 'document',
    name: 'Document Analysis',
    color: '#FF9800',
    icon: <FileText className="w-5 h-5" />,
    description: 'Comprehensive document analysis and text processing'
  }
];

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [currentMode, setCurrentMode] = useState<AIMode>(AI_MODES[0]);
  const [isLanguageSwahili, setIsLanguageSwahili] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getCurrentDateTime = () => {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' :
                   day === 2 || day === 22 ? 'nd' :
                   day === 3 || day === 23 ? 'rd' : 'th';
    
    return `${dayName} ${day}${suffix} ${month} ${year}`;
  };

  const getWelcomeMessage = () => {
    const dateTime = getCurrentDateTime();
    const greeting = isLanguageSwahili 
      ? `Karibu XLYGER AI, msaidizi wako mahiri! Leo ni ${dateTime}. Uko katika hali ya ${currentMode.name}. Ninawezaje kukusaidia?`
      : `Welcome to XLYGER AI, your smart assistant! Today is ${dateTime}. You are in ${currentMode.name} mode. How can I help you?`;
    
    return greeting;
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: currentMode.id
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const dateTime = getCurrentDateTime();
      const systemPrompt = isLanguageSwahili 
        ? `Wewe ni XLYGER AI (inayotamkwa kama SLIGER AI), msaidizi mahiri wa AI uliyetengenezwa na Google lakini umeundwa na Jastine Ayubu. Leo ni ${dateTime}. Uko katika hali ya ${currentMode.name} - ${currentMode.description}. Jibu kwa lugha ya Kiswahili kwa uongozi na heshima. Anza jibu lako kwa tarehe na siku ya leo.`
        : `You are XLYGER AI (pronounced SLIGER AI), a smart AI assistant developed by Google but constructed by Jastine Ayubu. Today is ${dateTime}. You are in ${currentMode.name} mode - ${currentMode.description}. Respond with polite and responsible language. Start your response with today's date and day.`;

      console.log('Making API request to local server...');
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ content: inputText }],
          systemPrompt: systemPrompt,
          isLanguageSwahili: isLanguageSwahili
        })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`API request failed: ${response.status} - ${errorData.error}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      const aiText = data.choices[0].message.content;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: currentMode.id
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: isLanguageSwahili 
          ? 'Samahani, nimepata tatizo la kiufundi. Tafadhali jaribu tena.'
          : 'Sorry, I encountered a technical issue. Please try again.',
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: currentMode.id
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isLanguageSwahili ? 'sw-TZ' : 'en-US';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (fallbackErr) {
        console.error('Failed to copy text:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <button 
            className="menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        </div>
        
        <div className="header-center">
          <div 
            className="mode-indicator"
            style={{ backgroundColor: currentMode.color }}
          >
            {currentMode.icon}
          </div>
          <span className="mode-name">{currentMode.name}</span>
        </div>
        
        <div className="header-right">
          <div className="status-indicator"></div>
        </div>
      </header>

      {/* Menu Sidebar */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={() => setIsMenuOpen(false)}>
          <div className="menu-sidebar" onClick={e => e.stopPropagation()}>
            <div className="menu-header">
              <h3>XLYGER AI Modes</h3>
            </div>
            <div className="menu-modes">
              {AI_MODES.map(mode => (
                <button
                  key={mode.id}
                  className={`mode-item ${currentMode.id === mode.id ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentMode(mode);
                    setIsMenuOpen(false);
                  }}
                  style={{ borderLeftColor: mode.color }}
                >
                  <div className="mode-icon" style={{ color: mode.color }}>
                    {mode.icon}
                  </div>
                  <div className="mode-info">
                    <div className="mode-title">{mode.name}</div>
                    <div className="mode-desc">{mode.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <main className="messages-container">
        {messages.length === 0 && (
          <div className="welcome-message">
            <div className="welcome-icon">
              <Brain className="w-12 h-12" style={{ color: currentMode.color }} />
            </div>
            <h2>XLYGER AI</h2>
            <p>{getWelcomeMessage()}</p>
          </div>
        )}
        
        {messages.map(message => (
          <div key={message.id} className={`message ${message.isUser ? 'user' : 'ai'}`}>
            {!message.isUser && (
              <div 
                className="message-avatar"
                style={{ backgroundColor: currentMode.color }}
              >
                AI
              </div>
            )}
            <div className="message-content">
              <div className="message-text">{message.text}</div>
              <div className="message-actions">
                <span className="message-time">{message.timestamp}</span>
                {!message.isUser && (
                  <div className="message-buttons">
                    <button 
                      className="action-btn"
                      onClick={() => speakText(message.text)}
                      title="Listen"
                    >
                      <Volume2 className="w-4 h-4" />
                      Listen
                    </button>
                    <button 
                      className="action-btn"
                      onClick={() => copyToClipboard(message.text)}
                      title="Copy"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                  </div>
                )}
              </div>
            </div>
            {message.isUser && (
              <div className="user-avatar">You</div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="message ai">
            <div 
              className="message-avatar"
              style={{ backgroundColor: currentMode.color }}
            >
              AI
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="input-area">
        <div className="input-container">
          <button className="language-btn" onClick={() => setIsLanguageSwahili(!isLanguageSwahili)}>
            <Globe className="w-5 h-5" />
            {isLanguageSwahili ? 'SW' : 'EN'}
          </button>
          
          <button className="voice-btn">
            <Mic className="w-5 h-5" />
          </button>
          
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isLanguageSwahili ? "Andika ujumbe wako..." : "Type your message..."}
            className="message-input"
            disabled={isLoading}
          />
          
          <button 
            className="send-btn"
            onClick={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        <div className="footer-text">
          <span>XLYGER AI can make mistakes. Please verify important information.</span>
          <br />
          <span style={{ color: currentMode.color }}>Made with ❤️ by Jastine Ayubu</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
