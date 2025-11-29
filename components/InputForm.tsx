import React, { useState } from 'react';

interface InputFormProps {
  onSubmit: (data: { 
    url1: string; title1: string; theme1: string; cover1: string; lyrics1: string;
    url2: string; title2: string; theme2: string; cover2: string; lyrics2: string;
  }) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [url1, setUrl1] = useState('');
  const [title1, setTitle1] = useState('');
  const [theme1, setTheme1] = useState('');
  const [cover1, setCover1] = useState('');
  const [lyrics1, setLyrics1] = useState('');

  const [url2, setUrl2] = useState('');
  const [title2, setTitle2] = useState('');
  const [theme2, setTheme2] = useState('');
  const [cover2, setCover2] = useState('');
  const [lyrics2, setLyrics2] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url1 && url2) {
      onSubmit({ 
        url1, title1, theme1, cover1, lyrics1,
        url2, title2, theme2, cover2, lyrics2 
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-8 bg-card-bg/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
      <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-neon-blue to-neon-pink bg-clip-text text-transparent uppercase tracking-widest">
        Suno Battle Arena
      </h1>
      <p className="text-gray-400 text-center mb-8">
        Enter Suno song links. Add Titles, Covers, and Lyrics for the best results!
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Challenger 1 */}
          <div className="p-6 rounded-xl bg-dark-bg/50 border border-neon-blue/30 relative overflow-hidden flex flex-col gap-4">
            <div className="absolute top-0 left-0 w-1 h-full bg-neon-blue"></div>
            <h3 className="text-xl font-bold text-neon-blue uppercase tracking-wider flex items-center gap-2">
              <span className="bg-neon-blue text-black w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
              Challenger One
            </h3>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase">Suno Link (Required)</label>
              <input
                type="url"
                required
                placeholder="https://suno.com/s/..."
                value={url1}
                onChange={(e) => setUrl1(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">Song Title</label>
                <input
                  type="text"
                  placeholder="e.g. Cyber City"
                  value={title1}
                  onChange={(e) => setTitle1(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">Theme / Keywords</label>
                <input
                  type="text"
                  placeholder="e.g. Aggressive"
                  value={theme1}
                  onChange={(e) => setTheme1(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase">Cover / Video URL</label>
              <input
                type="url"
                placeholder="https://cdn1.suno.ai/...mp4"
                value={cover1}
                onChange={(e) => setCover1(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase">Lyrics (Optional)</label>
              <textarea
                placeholder="Paste lyrics here to generate better skills..."
                value={lyrics1}
                onChange={(e) => setLyrics1(e.target.value)}
                rows={3}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue transition-colors text-xs resize-y"
              />
            </div>
          </div>

          {/* Challenger 2 */}
          <div className="p-6 rounded-xl bg-dark-bg/50 border border-neon-pink/30 relative overflow-hidden flex flex-col gap-4">
            <div className="absolute top-0 left-0 w-1 h-full bg-neon-pink"></div>
            <h3 className="text-xl font-bold text-neon-pink uppercase tracking-wider flex items-center gap-2">
              <span className="bg-neon-pink text-black w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
              Challenger Two
            </h3>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase">Suno Link (Required)</label>
              <input
                type="url"
                required
                placeholder="https://suno.com/s/..."
                value={url2}
                onChange={(e) => setUrl2(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-pink transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">Song Title</label>
                <input
                  type="text"
                  placeholder="e.g. Forest Song"
                  value={title2}
                  onChange={(e) => setTitle2(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-pink transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">Theme / Keywords</label>
                <input
                  type="text"
                  placeholder="e.g. Calm"
                  value={theme2}
                  onChange={(e) => setTheme2(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-pink transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase">Cover / Video URL</label>
              <input
                type="url"
                placeholder="https://cdn1.suno.ai/...jpeg"
                value={cover2}
                onChange={(e) => setCover2(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-pink transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase">Lyrics (Optional)</label>
              <textarea
                placeholder="Paste lyrics here to generate better skills..."
                value={lyrics2}
                onChange={(e) => setLyrics2(e.target.value)}
                rows={3}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-pink transition-colors text-xs resize-y"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-lg font-bold text-lg uppercase tracking-widest transition-all duration-300
            ${isLoading 
              ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
              : 'bg-gradient-to-r from-neon-blue via-purple-600 to-neon-pink hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(188,19,254,0.5)] text-white'
            }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Audio Data...
            </span>
          ) : 'Initiate Battle'}
        </button>
      </form>
    </div>
  );
};

export default InputForm;