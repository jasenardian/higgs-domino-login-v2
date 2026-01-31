
import { useState } from 'react';
import { FaHeadset, FaUser, FaFacebookF, FaGlobeAsia, FaCaretDown } from 'react-icons/fa';
import { BsPersonFill } from 'react-icons/bs';
import LoginForm from './LoginForm';

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegion, setShowRegion] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('Asia');
  const [agreed, setAgreed] = useState(true);

  const regions = [
    'Africa',
    'Asia',
    'Europe',
    'North America',
    'South America'
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans select-none bg-black">
      
      {/* 1. REAL BACKGROUND IMAGE (Always visible) */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('https://scontent-cgk1-2.xx.fbcdn.net/v/t39.30808-6/546099017_122259680486224279_8076638585639048773_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeEe5rYWX4oSvg2JR02IW9FX2npjU4z6MczaemNTjPoxzGgCU1yfPSPL4t_tRxjtbWIkKRATREHAEUnwGwa2uRIP&_nc_ohc=ruihFEQq14IQ7kNvwFOW5KD&_nc_oc=AdmiCBhD7CRT3HIQJXZdcHQwOHJ1q3AlZkPs7gj_A_VZGLlsbfbzLhW52K-3tV-1IHI&_nc_zt=23&_nc_ht=scontent-cgk1-2.xx&_nc_gid=pramOKMXl9i3w_2vk9HrRg&oh=00_AfvvSqVNlEsaNeZI0HBZm3anq1jnorlv7N5kM9xkpvEHcg&oe=69840540')`
        }}
      >
      </div>

      {/* LOGIN POPUP OVERLAY */}
      {showLogin && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] animate-fade-in">
          {/* Close button handled inside LoginForm or here */}
           <div className="relative z-10 w-full max-w-sm animate-pop-in">
             <LoginForm />
             {/* Transparent close area behind form is handled by the overlay div itself mostly, 
                 but explicit close button is inside LoginForm component now as requested in previous design */}
           </div>
           
           {/* Click outside to close (Optional) */}
           <div className="absolute inset-0 z-0" onClick={() => setShowLogin(false)}></div>
        </div>
      )}

      {/* 2. TOP LEFT MENU (Vertical Buttons) */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-4">
        {/* Service Button */}
        <button className="flex flex-col items-center group active:scale-95 transition-transform">
          <div className="w-10 h-10 rounded-full bg-[#1e2532]/80 border-[1.5px] border-[#d4af37] flex items-center justify-center shadow-lg">
            <FaHeadset className="text-[#ffd700] text-lg drop-shadow-md" />
          </div>
          <span className="text-white text-[11px] font-bold mt-1 drop-shadow-[0_2px_2px_rgba(0,0,0,1)] stroke-black tracking-wide" style={{ textShadow: '0px 1px 2px #000' }}>
            Service
          </span>
        </button>

        {/* ID Login Button */}
        <button 
          onClick={() => setShowLogin(true)}
          className="flex flex-col items-center group active:scale-95 transition-transform"
        >
          <div className="w-10 h-10 rounded-full bg-[#1e2532]/80 border-[1.5px] border-[#d4af37] flex items-center justify-center shadow-lg">
            <FaUser className="text-[#ffd700] text-lg drop-shadow-md" />
          </div>
          <span className="text-white text-[11px] font-bold mt-1 drop-shadow-[0_2px_2px_rgba(0,0,0,1)] tracking-wide" style={{ textShadow: '0px 1px 2px #000' }}>
            ID Login
          </span>
        </button>
      </div>

      {/* 3. TOP RIGHT LOGO */}
      <div className="absolute top-4 right-4 z-20">
        <div className="relative rotate-[-2deg] scale-90 md:scale-100 origin-top-right">
          {/* Main Text 'Domino' */}
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#ffd700] via-[#ff9000] to-[#ff6b00]"
              style={{ 
                WebkitTextStroke: '2px #004d00', 
                filter: 'drop-shadow(0px 4px 0px #003300) drop-shadow(0px 6px 4px rgba(0,0,0,0.5))',
                fontFamily: 'Verdana, sans-serif'
              }}>
            Domino
          </h1>
          {/* Sub Text 'Higgs' */}
          <span className="absolute -bottom-2 right-4 text-[#00ffcc] font-serif italic font-bold text-2xl drop-shadow-[0_2px_0_#000] rotate-[-5deg]"
                style={{ WebkitTextStroke: '0.5px #000', textShadow: '2px 2px 0px #000' }}>
            Higgs
          </span>
          {/* Flower Icon */}
          <div className="absolute -top-1 -right-2 text-pink-500 text-3xl drop-shadow-md animate-pulse">🌸</div>
        </div>
      </div>

      {/* 4. CENTER & BOTTOM UI */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-2 md:pb-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-2xl flex flex-col items-center">
          
          {/* REGION SELECTOR (Floating Center with Dropdown) */}
          <div className="mb-3 md:mb-5 relative w-[280px] md:w-[320px]">
            {/* Dropdown Menu (Shows when active) */}
            {showRegion && (
              <div className="absolute bottom-full mb-2 left-0 w-full bg-[#2a1a11]/95 border-[1.5px] border-[#d4af37] rounded-xl shadow-[0_8px_16px_rgba(0,0,0,0.8)] overflow-hidden animate-pop-in z-30">
                <div className="flex flex-col py-1">
                  {regions.map((region) => (
                    <button
                      key={region}
                      onClick={() => {
                        setSelectedRegion(region);
                        setShowRegion(false);
                      }}
                      className={`py-3 text-center font-bold text-sm md:text-base transition-colors
                        ${selectedRegion === region 
                          ? 'bg-gradient-to-r from-[#2a1a11] via-[#5d4037] to-[#2a1a11] text-[#ffd700] shadow-inner' 
                          : 'text-[#e0e0e0] hover:bg-white/5'
                        }`}
                      style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.8)' }}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selector Bar */}
            <button 
              onClick={() => setShowRegion(!showRegion)}
              className="w-full h-10 md:h-12 bg-[#2a1a11]/90 border-[1.5px] border-[#d4af37] rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.6)] flex items-center justify-between px-4 active:scale-95 transition-transform"
            >
               <div className="flex items-center gap-3 text-[#ffd700]">
                  <div className="w-6 h-6 rounded-full bg-[#1a120b] border border-[#d4af37] flex items-center justify-center">
                    <FaGlobeAsia className="text-sm" />
                  </div>
                  <div className="h-6 w-[1px] bg-[#d4af37]/30"></div>
               </div>
               <span className="text-[#f5e6c8] font-bold text-base tracking-wide drop-shadow-md uppercase">
                 {selectedRegion}
               </span>
               <FaCaretDown className={`text-[#ffd700] transition-transform duration-300 ${showRegion ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* MAIN ACTION BUTTONS */}
          <div className="flex gap-3 items-center mb-3 px-8 w-full justify-center">
            
            {/* Facebook Button (Blue) */}
            <button className="flex-1 relative group active:scale-95 transition-all duration-100 h-12 md:h-14">
              {/* 20M Badge */}
              <div className="absolute -top-2 -right-2 bg-gradient-to-b from-[#ff5e3a] to-[#d63031] text-white text-[10px] font-black px-2 py-0.5 rounded-full z-20 border-[1.5px] border-white shadow-sm transform rotate-6">
                20M
              </div>
              {/* Button Body */}
              <div className="w-full h-full bg-gradient-to-b from-[#4facfe] to-[#00f2fe] rounded-xl border-b-[4px] border-[#005c97] flex items-center justify-center relative overflow-hidden shadow-lg group-hover:brightness-110">
                 {/* Glossy Effect */}
                 <div className="absolute top-0 w-full h-1/2 bg-white/20 rounded-t-xl pointer-events-none"></div>
                 
                 <div className="absolute left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-inner">
                    <FaFacebookF className="text-[#005c97] text-xl" />
                 </div>
                 <span className="text-white font-black text-sm md:text-base drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] ml-8 uppercase tracking-wide">
                   Login with Facebook
                 </span>
              </div>
            </button>

            {/* Guest Button (Orange) */}
            <button className="flex-1 relative group active:scale-95 transition-all duration-100 h-12 md:h-14">
              <div className="w-full h-full bg-gradient-to-b from-[#ff9966] to-[#ff5e62] rounded-xl border-b-[4px] border-[#c0392b] flex items-center justify-center relative overflow-hidden shadow-lg group-hover:brightness-110">
                 {/* Glossy Effect */}
                 <div className="absolute top-0 w-full h-1/2 bg-white/20 rounded-t-xl pointer-events-none"></div>
                 
                 <div className="absolute left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-inner">
                    <BsPersonFill className="text-[#d35400] text-xl" />
                 </div>
                 <span className="text-white font-black text-sm md:text-base drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] ml-8 uppercase tracking-wide">
                   Play as Guest
                 </span>
              </div>
            </button>
          </div>

          {/* Footer Consent */}
          <div className="flex items-center justify-center gap-2 text-[10px] text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,1)] mb-1 px-4 text-center w-full">
            <button 
              onClick={() => setAgreed(!agreed)}
              className={`w-3 h-3 md:w-4 md:h-4 rounded-full border border-[#ffd700] flex items-center justify-center flex-shrink-0 transition-colors bg-black/40 shadow-inner`}
            >
              {agreed && <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-[#ffd700] rounded-full shadow-[0_0_4px_#ffd700]"></div>}
            </button>
            <span className="leading-tight font-medium" style={{ textShadow: '0px 1px 2px #000' }}>
              I have read and agree to the <span className="text-[#00ffcc] font-bold underline cursor-pointer hover:text-white transition-colors">Privacy Policy</span> and <span className="text-[#00ffcc] font-bold underline cursor-pointer hover:text-white transition-colors">User Agreement</span>
            </span>
          </div>
        </div>
      </div>

      {/* Version */}
      <div className="absolute bottom-1 right-1 z-20 text-[10px] text-[#00ffcc]/80 font-mono font-bold drop-shadow-md tracking-wider">
        v2.39
      </div>
    </div>
  );
};

export default Home;
