# StudyAI - Personal Learning App

🎓 An AI-powered study planner with flashcards, study schedule, and video search.

## Features

- **📤 Upload or Paste** - Add lecture notes or study material (text or file)
- **🤖 AI Analysis** - Automatically generates study materials using Claude API
- **📚 Key Concepts** - Extract and display main topics
- **🃏 Flashcards** - Interactive spaced repetition learning
- **🗓️ Study Plan** - Smart study schedule (today, tomorrow, day after, next week)
- **🎥 Video Search** - Get YouTube search queries for visual learning

## Project Structure

```
study-ai-app/
├── src/
│   ├── App.jsx          # Main React component
│   └── ...
├── api/
│   └── analyze.js       # API endpoint for Claude analysis
├── README.md            # This file
└── ...
```

## Tech Stack

- **React** - UI framework
- **Claude API (Anthropic)** - AI analysis and content generation
- **JavaScript (ES6+)** - Core language
- **CSS-in-JS** - Inline styling
- **Vercel** - Deployment platform

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Anthropic API key

### Installation

```bash
# Clone the repository
git clone https://github.com/deylinasanon-a11y/study-ai-app.git
cd study-ai-app

# Install dependencies
npm install
```

### Setup

1. Create a `.env.local` file in the root directory (for local development)
2. Add your Anthropic API key:
   ```
   REACT_APP_ANTHROPIC_API_KEY=your_api_key_here
   ```

3. For Vercel deployment:
   - Add `ANTHROPIC_API_KEY` environment variable in Vercel dashboard (Settings → Environment Variables)

### Running the App

```bash
# Start development server
npm start

# The app will open at http://localhost:3000
```

## How to Use

1. **Paste or Upload Material** - Copy lecture notes or upload a `.txt`/`.md` file
2. **Click "Build My Study Plan"** - AI analyzes your material
3. **Explore Tabs**:
   - 📚 **Overview** - Read key concepts
   - 📋 **Plan** - See your personalized study schedule
   - 🃏 **Flashcards** - Quiz yourself and track progress
   - 🎥 **Videos** - Get recommendations for related videos

## API Reference

### Claude API Integration

The app uses the Anthropic Claude API to:
- Analyze study material
- Generate key points (5 key concepts)
- Create flashcard questions and answers (5 flashcards)
- Build personalized study plans (today, tomorrow, day after, next week)
- Suggest YouTube and image search queries

**Endpoint**: `https://api.anthropic.com/v1/messages`  
**Model**: `claude-sonnet-4-6`  
**Max Tokens**: 2000  
**Input Limit**: 3000 characters (automatically truncated to prevent token overflow)

## Features in Development

- [ ] Cloud storage for study sessions
- [ ] User authentication
- [ ] Progress tracking and analytics
- [ ] Export study plans
- [ ] Spaced repetition algorithm optimization
- [ ] Mobile app
- [ ] Offline mode

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues:
- Open an issue on GitHub
- Contact: deylinasanon@gmail.com

---

**Happy studying! 🚀**
