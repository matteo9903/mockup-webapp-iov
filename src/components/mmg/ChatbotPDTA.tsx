import { useState } from 'react';
import { ArrowLeft, Send, Bot, User } from 'lucide-react';

interface ChatbotPDTAProps {
  onBack: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

function ChatbotPDTA({ onBack }: ChatbotPDTAProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Ciao! Sono il tuo assistente per i PDTA dell\'IOV.\n\nPosso aiutarti a valutare casi clinici, identificare gli esami preliminari necessari e interpretare i Percorsi Diagnostico-Terapeutici.\n\nLe mie risposte si basano esclusivamente sui documenti PDTA caricati.\n\nDescrivi il caso clinico o fai una domanda per iniziare.',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Questa è una demo. Il chatbot AI verrà integrato con i documenti PDTA reali per fornire assistenza basata sui percorsi diagnostico-terapeutici dell\'IOV.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-iov-dark-blue hover:text-iov-dark-blue-hover mb-6 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Torna alla Home
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-iov-dark-blue to-iov-dark-blue-hover p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Bot className="w-8 h-8" />
            Chatbot PDTA - Assistente AI
          </h2>
          <p className="text-blue-100 mt-2">
            Assistente virtuale per valutazione casi clinici e interpretazione PDTA
          </p>
        </div>

        <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'bot' && (
                <div className="bg-iov-dark-blue w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-6 h-6 text-white" />
                </div>
              )}
              <div
                className={`max-w-[70%] rounded-lg p-4 ${
                  message.sender === 'user'
                    ? 'bg-iov-dark-blue text-white'
                    : 'bg-white border border-gray-200 text-iov-gray-text'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString('it-IT', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              {message.sender === 'user' && (
                <div className="bg-iov-dark-blue w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Descrivi il caso clinico o fai una domanda..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue"
            />
            <button
              onClick={handleSend}
              className="bg-iov-dark-blue hover:bg-iov-dark-blue-hover text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
            >
              <Send className="w-5 h-5" />
              Invia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatbotPDTA;

