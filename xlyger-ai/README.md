# XLYGER AI (pronounced SLIGER AI)

A modern, feature-rich AI chat interface with multi-language support and advanced capabilities.

## Features

### 🎨 **Modern UI Design**
- Dark theme with gradient background
- Responsive design matching mobile-first approach
- Clean, intuitive interface inspired by modern chat applications

### 🤖 **Multiple AI Modes**
- **General AI** (Pink) - General purpose assistance and conversation
- **Voice Processing** (Blue) - Voice-related tasks and audio processing
- **Image Processing** (Green) - Image analysis and visual content processing  
- **Document Analysis** (Orange) - Document processing and analysis

### 🌍 **Multi-Language Support**
- **English (EN)** - Full English interface and responses
- **Kiswahili (SW)** - Complete Swahili language support for Tanzania users
- Seamless language switching with translated UI elements

### 🔊 **Voice Features**
- **Text-to-Speech** - Listen to AI responses with speaker button
- **Voice Input** - Microphone button for voice commands (ready for implementation)
- Natural speech synthesis for accessibility

### 🎯 **Smart AI Assistant**
- Powered by advanced language models via OpenRouter API
- Contextual responses with date/time awareness
- Polite and responsible language
- Developed by Google, constructed by Jastine Ayubu

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: CSS3 with custom gradients and animations
- **Icons**: Lucide React for modern iconography
- **Voice**: React Speech Kit for text-to-speech
- **Backend**: Express.js proxy server
- **AI**: OpenRouter API with Llama 3.2 model
- **Build**: Create React App with optimized production builds

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd xlyger-ai
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Build the application:
```bash
npm run build
```

4. Start the server:
```bash
node server.js
```

5. Open your browser and navigate to `http://localhost:12001`

## Project Structure

```
xlyger-ai/
├── public/                 # Static assets
├── src/
│   ├── App.tsx            # Main application component
│   ├── App.css            # Styling and themes
│   └── index.tsx          # Application entry point
├── server.js              # Express proxy server
├── package.json           # Dependencies and scripts
└── README.md             # Project documentation
```

## Features in Detail

### AI Modes
Each mode provides specialized assistance:
- **General AI**: Everyday questions, conversations, and general help
- **Voice Processing**: Audio-related tasks and voice command processing
- **Image Processing**: Visual content analysis and image-related queries
- **Document Analysis**: Text processing, document review, and analysis

### Language Support
- Dynamic language switching between English and Kiswahili
- Translated UI elements including placeholders and buttons
- AI responses in the selected language
- Cultural context awareness for Tanzanian users

### Voice Integration
- Text-to-speech for all AI responses
- Accessible audio controls
- Future-ready voice input capabilities

## API Integration

The application uses OpenRouter API for AI responses:
- Model: `meta-llama/llama-3.2-3b-instruct:free`
- Proxy server handles CORS and authentication
- Fallback error handling for robust user experience

## Contributing

This project was developed by Jastine Ayubu. For contributions or issues, please contact the developer.

## License

This project is developed for educational and demonstration purposes.

---

**Made with ❤️ by Jastine Ayubu**

*XLYGER AI - Your Smart Assistant*