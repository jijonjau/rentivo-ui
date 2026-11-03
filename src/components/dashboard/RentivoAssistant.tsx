'use client';

import { useRef, useState, KeyboardEvent } from 'react';
import {
  Sparkles,
  Paperclip,
  Mic,
  Send,
  X,
  FileText,
  Bot,
  User,
  ArrowUpRight,
} from 'lucide-react';

type UserRole = 'SUPER_ADMIN' | 'AGENCY' | 'LANDLORD' | 'TENANT';

interface RentivoAssistantProps {
  role: UserRole;
  onSend?: (message: string, file?: File) => void;
  onVoiceNote?: () => void;
}

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'assistant';
}

const rolePrompts: Record<UserRole, string[]> = {
  SUPER_ADMIN: [
    'Give me a summary of platform performance.',
    'Which properties have the most outstanding rent?',
    'Summarise recent platform activities.',
  ],
  AGENCY: [
    'Give me an overview of my agency performance.',
    'Which tenants have outstanding rent?',
    'Show me properties with vacant units.',
  ],
  LANDLORD: [
    'Summarise my rental income this month.',
    'Which tenants have outstanding rent?',
    'Give me an update on reported issues.',
  ],
  TENANT: [
    'When is my next rent payment due?',
    'Show me my recent payment history.',
    'How can I report a maintenance issue?',
  ],
};

const roleDescriptions: Record<UserRole, string> = {
  SUPER_ADMIN: 'your Rentivo platform',
  AGENCY: 'your agency operations',
  LANDLORD: 'your properties and rental income',
  TENANT: 'your home and rental account',
};

export default function RentivoAssistant({
  role,
  onSend,
  onVoiceNote,
}: RentivoAssistantProps) {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage && !selectedFile) return;

    if (trimmedMessage) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          content: trimmedMessage,
          sender: 'user',
        },
      ]);
    }

    onSend?.(trimmedMessage, selectedFile ?? undefined);

    setMessage('');
    setSelectedFile(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) setSelectedFile(file);
  };

  const handleSuggestion = (prompt: string) => {
    setMessage(prompt);
  };

  return (
    <div className="flex h-full min-h-[500px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
          <Sparkles className="h-5 w-5 text-blue-600" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900">Rentivo AI Assistant</h3>
          <p className="text-xs text-emerald-600">
            Your intelligent rental assistant
          </p>
        </div>

        <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Online
        </span>
      </div>

      {/* Conversation */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
              <Bot className="h-7 w-7 text-blue-600" />
            </div>

            <h4 className="text-lg font-semibold text-slate-900">
              Hello! How can I help?
            </h4>

            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
              I can help you understand {roleDescriptions[role]}, track
              important activities and get things done.
            </p>

            <div className="mt-6 w-full text-left">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Suggested prompts
              </p>

              <div className="space-y-2">
                {rolePrompts[role].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSuggestion(prompt)}
                    className="group flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-3 text-left text-sm text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <span>{prompt}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-blue-600" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-2 ${
                item.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {item.sender === 'assistant' && (
                <div className="rounded-lg bg-blue-50 p-2">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 text-sm ${
                  item.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {item.content}
              </div>

              {item.sender === 'user' && (
                <div className="rounded-lg bg-slate-100 p-2">
                  <User className="h-4 w-4 text-slate-600" />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Selected attachment */}
      {selectedFile && (
        <div className="mx-4 mb-2 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
          <FileText className="h-4 w-4 text-blue-600" />
          <span className="flex-1 truncate text-xs text-slate-600">
            {selectedFile.name}
          </span>
          <button
            onClick={() => {
              setSelectedFile(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="text-slate-400 hover:text-red-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="border border-slate-200 p-4 mx-4 mb-4 rounded-lg">
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Rentivo AI anything..."
          rows={2}
          className="w-full resize-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg"
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              title="Attach a file"
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-blue-600"
            >
              <Paperclip className="h-5 w-5" />
            </button>

            <button
              onClick={onVoiceNote}
              title="Record a voice note"
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-blue-600"
            >
              <Mic className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={handleSend}
            disabled={!message.trim() && !selectedFile}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
