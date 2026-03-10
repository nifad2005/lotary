/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  UserPlus, 
  Trash2, 
  RefreshCw, 
  History, 
  Sparkles,
  X,
  User,
  Calendar,
  Briefcase
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  date: string;
}

interface DrawResult {
  id: string;
  winner: string;
  winnerDate: string;
  taskName: string;
  timestamp: number;
}

export default function App() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newName, setNewName] = useState('');
  const [taskName, setTaskName] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [history, setHistory] = useState<DrawResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load from local storage
  useEffect(() => {
    const savedParticipants = localStorage.getItem('lotto_participants');
    const savedHistory = localStorage.getItem('lotto_history');
    if (savedParticipants) setParticipants(JSON.parse(savedParticipants));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('lotto_participants', JSON.stringify(participants));
  }, [participants]);

  useEffect(() => {
    localStorage.setItem('lotto_history', JSON.stringify(history));
  }, [history]);

  const addParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newName.trim();
    if (!trimmedName) return;

    // Check for duplicate names (case-insensitive)
    const isDuplicate = participants.some(
      (p) => p.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      alert('এই নামটি ইতিমধ্যে তালিকায় আছে!');
      return;
    }
    
    const newParticipant: Participant = {
      id: Math.random().toString(36).substr(2, 9),
      name: trimmedName,
      date: newDate
    };
    
    setParticipants([...participants, newParticipant]);
    setNewName('');
    setNewDate(new Date().toISOString().split('T')[0]);
  };

  const selectWinnerManually = (participant: Participant) => {
    if (isDrawing) return;
    
    setIsDrawing(true);
    setWinner(null);

    // Simulate drawing animation but with a fixed winner
    setTimeout(() => {
      setWinner(participant);
      setIsDrawing(false);
      
      const newResult: DrawResult = {
        id: Math.random().toString(36).substr(2, 9),
        winner: participant.name,
        winnerDate: participant.date,
        taskName: taskName.trim() || 'সাধারণ ড্র',
        timestamp: Date.now()
      };
      setHistory([newResult, ...history].slice(0, 50));
    }, 1500); // Shorter animation for manual selection
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const clearParticipants = () => {
    if (confirm('সব অংশগ্রহণকারীকে কি মুছে ফেলতে চান?')) {
      setParticipants([]);
    }
  };

  const startDraw = () => {
    if (participants.length < 2) {
      alert('ড্র শুরু করতে অন্তত ২ জন অংশগ্রহণকারী যোগ করুন!');
      return;
    }

    setIsDrawing(true);
    setWinner(null);

    // Simulate drawing animation
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * participants.length);
      const selectedWinner = participants[randomIndex];
      
      setWinner(selectedWinner);
      setIsDrawing(false);
      
      const newResult: DrawResult = {
        id: Math.random().toString(36).substr(2, 9),
        winner: selectedWinner.name,
        winnerDate: selectedWinner.date,
        taskName: taskName.trim() || 'সাধারণ ড্র',
        timestamp: Date.now()
      };
      setHistory([newResult, ...history].slice(0, 50));
    }, 3000);
  };

  const clearHistory = () => {
    if (confirm('ড্র-এর ইতিহাস কি মুছে ফেলতে চান?')) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">লটো ড্র</h1>
          </div>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
            title="ইতিহাস"
          >
            <History className="w-6 h-6 text-gray-600" />
            {history.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full" />
            )}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Input & List */}
        <section className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> কাজের নাম (ঐচ্ছিক)
            </h2>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="যেমন: দুপুরের খাবার আনা, ফাইল জমা দেওয়া..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <UserPlus className="w-4 h-4" /> অংশগ্রহণকারী যোগ করুন
            </h2>
            <form onSubmit={addParticipant} className="flex flex-col gap-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="নাম লিখুন..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-gray-600"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100 active:scale-95 flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" /> যোগ করুন
              </button>
            </form>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-[400px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4" /> অংশগ্রহণকারীর তালিকা ({participants.length})
              </h2>
              {participants.length > 0 && (
                <button 
                  onClick={clearParticipants}
                  className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> সব মুছে ফেলুন
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {participants.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2"
                  >
                    <UserPlus className="w-8 h-8 opacity-20" />
                    <p className="text-sm">এখনো কোনো অংশগ্রহণকারী যোগ করা হয়নি</p>
                  </motion.div>
                ) : (
                  participants.map((p) => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100 group hover:border-indigo-200 transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-700">{p.name}</span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {p.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => selectWinnerManually(p)}
                          className="p-1.5 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="বিজয়ী হিসেবে নির্বাচন করুন"
                        >
                          <Trophy className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => removeParticipant(p.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="মুছে ফেলুন"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Right Column: Draw Area */}
        <section className="flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            
            <AnimatePresence mode="wait">
              {isDrawing ? (
                <motion.div
                  key="drawing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="space-y-6"
                >
                  <div className="relative">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full mx-auto"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <RefreshCw className="w-8 h-8 text-indigo-600 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-800">বিজয়ী নির্বাচন করা হচ্ছে...</h3>
                    <p className="text-gray-500">ভাগ্য নির্ধারিত হচ্ছে</p>
                  </div>
                </motion.div>
              ) : winner ? (
                <motion.div
                  key="winner"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, -10, 10, -10, 10, 0] }}
                    transition={{ 
                      scale: { type: "spring", damping: 12 },
                      rotate: { duration: 0.5, ease: "easeInOut" }
                    }}
                    className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-yellow-100"
                  >
                    <Trophy className="w-16 h-16 text-white" />
                  </motion.div>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-indigo-600 uppercase tracking-[0.2em]">অভিনন্দন!</p>
                    <h3 className="text-5xl font-black text-gray-900 break-words">{winner.name}</h3>
                    <p className="text-gray-500 flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" /> {winner.date} - আমাদের ভাগ্যবান বিজয়ী!
                    </p>
                  </div>
                  <button 
                    onClick={() => setWinner(null)}
                    className="text-sm text-gray-400 hover:text-gray-600 font-medium"
                  >
                    বন্ধ করুন
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-gray-200">
                    <Sparkles className="w-10 h-10 text-gray-300" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-800">ড্র করার জন্য প্রস্তুত?</h3>
                    <p className="text-gray-500 max-w-[200px] mx-auto">লটারি শুরু করতে অন্তত ২ জনকে যোগ করুন</p>
                  </div>
                  <button
                    onClick={startDraw}
                    disabled={participants.length < 2}
                    className={`
                      px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl
                      ${participants.length >= 2 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 active:scale-95' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}
                    `}
                  >
                    এখনই ড্র করুন
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-indigo-900 rounded-3xl p-6 text-white overflow-hidden relative">
            <div className="relative z-10">
              <h4 className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-2">ছোট টিপস</h4>
              <p className="text-sm text-indigo-100 leading-relaxed">
                আপনি এটি গিভঅ্যাওয়ে, দুপুরের খাবারের বিল কে দেবে তা নির্ধারণ করতে বা যেকোনো র্যান্ডম কাজের জন্য ব্যবহার করতে পারেন!
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-800 rounded-full blur-2xl opacity-50" />
          </div>
        </section>
      </main>

      {/* History Drawer */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-30 flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-600" /> ড্র-এর ইতিহাস
                </h2>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {history.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center space-y-2">
                    <History className="w-12 h-12 opacity-10" />
                    <p>এখনো কোনো ড্র হয়নি</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div key={item.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">বিজয়ী</span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{item.winner}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-[10px] text-gray-500 flex items-center gap-1">
                          <Briefcase className="w-3 h-3" /> {item.taskName}
                        </p>
                        <p className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {item.winnerDate}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {history.length > 0 && (
                <div className="p-6 border-t border-gray-100">
                  <button 
                    onClick={clearHistory}
                    className="w-full py-3 text-red-500 font-semibold hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> ইতিহাস মুছে ফেলুন
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D1D5DB;
        }
      `}</style>
    </div>
  );
}
