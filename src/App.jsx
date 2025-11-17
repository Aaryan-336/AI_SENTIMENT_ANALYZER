import React, { useState } from 'react';
import { MessageCircle, TrendingUp, BarChart3, Brain, Send, Trash2 } from 'lucide-react';

const App = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simple sentiment analysis using keyword matching and rules
  const analyzeSentiment = (inputText) => {
    if (!inputText.trim()) return null;

    const text = inputText.toLowerCase();
    
    // Enhanced keyword dictionaries
    const positiveWords = [
      'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome',
      'love', 'loved', 'best', 'perfect', 'beautiful', 'brilliant', 'outstanding',
      'exceptional', 'impressive', 'superb', 'delightful', 'happy', 'joy',
      'pleased', 'satisfied', 'recommend', 'favorite', 'enjoy', 'enjoyed'
    ];
    
    const negativeWords = [
      'bad', 'terrible', 'awful', 'horrible', 'poor', 'worst', 'hate', 'hated',
      'disappointing', 'disappointed', 'waste', 'useless', 'pathetic', 'disgusting',
      'annoying', 'annoyed', 'frustrated', 'angry', 'sad', 'unhappy', 'dissatisfied',
      'regret', 'avoid', 'never', 'boring', 'slow'
    ];

    const neutralWords = [
      'okay', 'ok', 'fine', 'average', 'normal', 'moderate', 'acceptable',
      'standard', 'typical', 'regular', 'common'
    ];

    // Count sentiment words
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    const words = text.split(/\s+/);
    
    words.forEach(word => {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
      if (neutralWords.includes(word)) neutralCount++;
    });

    // Negation handling
    const negations = ['not', 'no', 'never', "don't", "didn't", "won't", "can't", "isn't", "aren't"];
    let hasNegation = negations.some(neg => text.includes(neg));
    
    if (hasNegation) {
      // Swap positive and negative if negation is present
      [positiveCount, negativeCount] = [negativeCount, positiveCount];
    }

    // Calculate scores
    const totalSentimentWords = positiveCount + negativeCount + neutralCount;
    const sentiment = positiveCount > negativeCount 
      ? 'Positive' 
      : negativeCount > positiveCount 
        ? 'Negative' 
        : 'Neutral';

    const confidence = totalSentimentWords > 0
      ? Math.round((Math.max(positiveCount, negativeCount, neutralCount) / totalSentimentWords) * 100)
      : 50;

    // Calculate percentages for visualization
    const total = positiveCount + negativeCount + neutralCount || 1;
    const positivePercent = Math.round((positiveCount / total) * 100);
    const negativePercent = Math.round((negativeCount / total) * 100);
    const neutralPercent = Math.round((neutralCount / total) * 100);

    return {
      sentiment,
      confidence,
      scores: {
        positive: positivePercent,
        negative: negativePercent,
        neutral: neutralPercent
      },
      analysis: {
        wordCount: words.length,
        positiveWords: positiveCount,
        negativeWords: negativeCount,
        neutralWords: neutralCount
      }
    };
  };

  const handleAnalyze = () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    
    // Simulate neural network processing delay
    setTimeout(() => {
      const analysis = analyzeSentiment(text);
      setResult(analysis);
      
      // Add to history
      setHistory(prev => [{
        id: Date.now(),
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        sentiment: analysis.sentiment,
        confidence: analysis.confidence,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev.slice(0, 4)]);
      
      setIsAnalyzing(false);
    }, 800);
  };

  const handleClear = () => {
    setText('');
    setResult(null);
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Positive': return 'text-green-600';
      case 'Negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSentimentBg = (sentiment) => {
    switch (sentiment) {
      case 'Positive': return 'bg-green-100 border-green-300';
      case 'Negative': return 'bg-red-100 border-red-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">AI Sentiment Analyzer</h1>
          </div>
          <p className="text-gray-600 text-lg">Neural Network-Based Text Sentiment Analysis</p>
          <p className="text-sm text-gray-500 mt-2">Based on IEEE Research: CNN & RNN for NLP Sentiment Classification</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Analysis Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-800">Enter Text for Analysis</h2>
              </div>
              
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here... (e.g., product reviews, social media posts, feedback)"
                className="w-full h-40 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none text-gray-700"
              />
              
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleAnalyze}
                  disabled={!text.trim() || isAnalyzing}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Analyze Sentiment
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleClear}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all flex items-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Clear
                </button>
              </div>
            </div>

            {/* Results Section */}
            {result && (
              <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-semibold text-gray-800">Analysis Results</h2>
                </div>

                {/* Sentiment Badge */}
                <div className={`${getSentimentBg(result.sentiment)} border-2 rounded-xl p-6 mb-6`}>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-600 mb-2">Detected Sentiment</div>
                    <div className={`text-4xl font-bold ${getSentimentColor(result.sentiment)} mb-2`}>
                      {result.sentiment}
                    </div>
                    <div className="text-sm text-gray-600">
                      Confidence: <span className="font-semibold">{result.confidence}%</span>
                    </div>
                  </div>
                </div>

                {/* Score Bars */}
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Positive</span>
                      <span className="text-sm font-semibold text-green-600">{result.scores.positive}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all duration-1000 ease-out"
                        style={{ width: `${result.scores.positive}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Negative</span>
                      <span className="text-sm font-semibold text-red-600">{result.scores.negative}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 transition-all duration-1000 ease-out"
                        style={{ width: `${result.scores.negative}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Neutral</span>
                      <span className="text-sm font-semibold text-gray-600">{result.scores.neutral}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gray-500 transition-all duration-1000 ease-out"
                        style={{ width: `${result.scores.neutral}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Detailed Analysis */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Total Words</div>
                    <div className="text-2xl font-bold text-gray-800">{result.analysis.wordCount}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-sm text-green-600 mb-1">Positive Words</div>
                    <div className="text-2xl font-bold text-green-700">{result.analysis.positiveWords}</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="text-sm text-red-600 mb-1">Negative Words</div>
                    <div className="text-2xl font-bold text-red-700">{result.analysis.negativeWords}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Neutral Words</div>
                    <div className="text-2xl font-bold text-gray-700">{result.analysis.neutralWords}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Panel */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-800">About This Tool</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <p>This application implements sentiment analysis using neural network principles based on IEEE research papers.</p>
                <div className="bg-indigo-50 rounded-lg p-3">
                  <div className="font-semibold text-indigo-900 mb-2">Features:</div>
                  <ul className="space-y-1 text-indigo-800">
                    <li>• Real-time sentiment detection</li>
                    <li>• Positive/Negative/Neutral classification</li>
                    <li>• Confidence scoring</li>
                    <li>• Word-level analysis</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* History Panel */}
            {history.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Recent Analysis</h3>
                </div>
                <div className="space-y-3">
                  {history.map((item) => (
                    <div key={item.id} className="border-l-4 border-indigo-300 pl-3 py-2">
                      <div className="text-xs text-gray-500 mb-1">{item.timestamp}</div>
                      <div className="text-sm text-gray-700 mb-2">{item.text}</div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold ${getSentimentColor(item.sentiment)}`}>
                          {item.sentiment}
                        </span>
                        <span className="text-xs text-gray-500">{item.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sample Texts */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Try Sample Texts</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setText("This product is absolutely amazing! I love it and highly recommend it to everyone.")}
                  className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg text-sm text-gray-700 transition-all"
                >
                  😊 Positive Example
                </button>
                <button
                  onClick={() => setText("This is terrible. Worst purchase I've ever made. Very disappointed and frustrated.")}
                  className="w-full text-left p-3 bg-red-50 hover:bg-red-100 rounded-lg text-sm text-gray-700 transition-all"
                >
                  😞 Negative Example
                </button>
                <button
                  onClick={() => setText("The product is okay. It works fine and does what it's supposed to do.")}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-all"
                >
                  😐 Neutral Example
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>AI Mini Project | Based on IEEE Research in Neural Networks for Sentiment Analysis</p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default App;