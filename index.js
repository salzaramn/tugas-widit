import React, { useState, useEffect, useMemo } from 'react';
import { 
  Gamepad2, 
  Heart, 
  Trophy, 
  ChevronRight, 
  CheckCircle2, 
  User, 
  Monitor, 
  Smartphone, 
  Layers, 
  Star, 
  MessageSquare, 
  Lightbulb, 
  Zap,
  Lock,
  Unlock,
  Skull,
  AlertTriangle
} from 'lucide-react';

const App = () => {
  const [screen, setScreen] = useState(0);
  const [xp, setXp] = useState(0);
  const [showXpToast, setShowXpToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // State for all survey answers
  const [formData, setFormData] = useState({
    screening: { playedIndie: null, activeGamer: null },
    profile: { country: "", age: "", platform: "", playtime: "" },
    level1: {}, // Marketing
    level2: {}, // E-WOM
    level3: {}, // Innovation
    finalBoss: {} // Purchase Intention
  });

  // Effect to handle XP toast
  const triggerXp = (amount) => {
    setXp(prev => prev + amount);
    setShowXpToast(true);
    setTimeout(() => setShowXpToast(false), 3000);
  };

  // Validation Logic for each screen
  const isScreenValid = useMemo(() => {
    switch (screen) {
      case 1: // Screening
        return formData.screening.playedIndie !== null && formData.screening.activeGamer !== null;
      case 2: // Profile
        return formData.profile.country !== "" && 
               formData.profile.age !== "" && 
               formData.profile.platform !== "" && 
               formData.profile.playtime !== "";
      case 3: // Level 1 (5 questions)
        return Object.keys(formData.level1).length === 5;
      case 4: // Level 2 (5 questions)
        return Object.keys(formData.level2).length === 5;
      case 5: // Level 3 (5 questions)
        return Object.keys(formData.level3).length === 5;
      case 6: // Final Boss (5 questions)
        return Object.keys(formData.finalBoss).length === 5;
      default:
        return true;
    }
  }, [screen, formData]);

  const handleNext = () => {
    if (isScreenValid) {
      if (screen === 1 && formData.screening.activeGamer === "No") {
        setErrorMsg("ACCESS DENIED: Only active gamers can proceed.");
        return;
      }
      if (screen === 2) triggerXp(100);
      setErrorMsg("");
      setScreen(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      setErrorMsg("QUEST REQUIREMENT: Complete all objectives to proceed.");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  // Components
  const ArcadeButton = ({ children, onClick, color = "teal", disabled = false, className = "" }) => {
    const colors = {
      teal: "bg-[#00f5d4] text-[#0d0221] border-[#00bfa5] shadow-[0_4px_0_#008e7a]",
      purple: "bg-[#b026ff] text-white border-[#8a1ecc] shadow-[0_4px_0_#6a179c]",
      gold: "bg-[#fee440] text-[#0d0221] border-[#d4bc35] shadow-[0_4px_0_#a8952a]",
      red: "bg-[#ff4d4d] text-white border-[#cc3d3d] shadow-[0_4px_0_#992e2e]",
      gray: "bg-gray-600 text-gray-300 border-gray-800 shadow-[0_4px_0_#333] cursor-not-allowed opacity-60"
    };

    const activeColor = disabled ? colors.gray : colors[color];

    return (
      <button 
        onClick={disabled ? null : onClick}
        className={`relative active:translate-y-1 active:shadow-none transition-all duration-75 font-bold py-4 px-8 rounded-xl border-b-4 flex items-center justify-center uppercase tracking-widest ${activeColor} ${className}`}
        style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '11px' }}
      >
        {children}
      </button>
    );
  };

  const HUDHeader = ({ title, level }) => (
    <div className="w-full flex flex-col gap-2 p-4 border-b-2 border-[#b026ff]/30 bg-[#0d0221]/90 backdrop-blur-md sticky top-0 z-20">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#b026ff]/20 rounded-lg border border-[#b026ff] shadow-[0_0_10px_rgba(176,38,255,0.3)]">
            <Gamepad2 size={18} className="text-[#b026ff]" />
          </div>
          <div>
            <p className="text-[9px] text-teal-400 uppercase tracking-tighter" style={{ fontFamily: '"Press Start 2P"' }}>LVL {level}</p>
            <h1 className="text-xs font-bold text-white uppercase tracking-wider">{title}</h1>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[8px] text-gray-500 uppercase font-bold">XP SCORE</p>
          <p className="text-[#fee440] font-bold animate-pulse" style={{ fontFamily: '"Press Start 2P"', fontSize: '10px' }}>{xp}</p>
        </div>
      </div>
      <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
        <div 
          className="h-full bg-gradient-to-r from-[#b026ff] via-[#00f5d4] to-[#fee440] transition-all duration-700"
          style={{ width: `${(screen / 7) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  const LikertHearts = ({ questionId, levelKey }) => {
    const selectedValue = formData[levelKey][questionId];
    
    return (
      <div className="flex justify-between items-center py-4 px-2 bg-black/20 rounded-xl mt-2">
        {[1, 2, 3, 4, 5].map((val) => (
          <button
            key={val}
            onClick={() => setFormData(prev => ({
              ...prev,
              [levelKey]: { ...prev[levelKey], [questionId]: val }
            }))}
            className="group flex flex-col items-center gap-2 outline-none"
          >
            <Heart 
              size={28} 
              fill={selectedValue >= val ? "#ff4d4d" : "transparent"} 
              className={`${selectedValue >= val ? "text-[#ff4d4d] drop-shadow-[0_0_8px_rgba(255,77,77,0.8)] scale-110" : "text-gray-700 group-hover:text-gray-500"} transition-all duration-200`}
            />
            <span className={`text-[8px] font-mono ${selectedValue === val ? "text-[#fee440]" : "text-gray-600"}`}>{val}</span>
          </button>
        ))}
      </div>
    );
  };

  const Card = ({ children, title, icon: Icon, glow = "teal", isComplete = false }) => {
    const glows = {
      teal: "border-[#00f5d4]/30 shadow-[0_0_15px_rgba(0,245,212,0.05)]",
      purple: "border-[#b026ff]/30 shadow-[0_0_15px_rgba(176,38,255,0.05)]",
      gold: "border-[#fee440]/30 shadow-[0_0_15px_rgba(254,228,64,0.05)]",
      red: "border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.05)]"
    };

    return (
      <div className={`bg-[#121225]/80 border-2 rounded-2xl p-5 mb-5 relative transition-all ${isComplete ? 'border-teal-500/50' : glows[glow]}`}>
        {isComplete && (
          <div className="absolute top-2 right-2">
            <CheckCircle2 size={16} className="text-teal-400" />
          </div>
        )}
        {Icon && <Icon className={`mb-3 ${isComplete ? 'text-teal-400' : 'text-gray-400 opacity-50'}`} size={20} />}
        {title && <h3 className="text-[#00f5d4] text-[9px] mb-4 uppercase tracking-[0.2em] font-bold" style={{ fontFamily: '"Press Start 2P"' }}>{title}</h3>}
        {children}
      </div>
    );
  };

  // Screen Rendering
  const renderScreen = () => {
    switch (screen) {
      case 0: // Start Screen
        return (
          <div className="flex flex-col items-center justify-center min-h-[85vh] text-center p-8 space-y-10 animate-in fade-in duration-700">
            <div className="relative">
              <div className="absolute -inset-4 bg-[#b026ff] blur-[60px] opacity-20 animate-pulse"></div>
              <h1 className="text-4xl font-black text-white leading-tight tracking-tighter drop-shadow-[0_5px_15px_rgba(176,38,255,0.5)]" style={{ fontFamily: '"Press Start 2P"', lineHeight: '1.4' }}>
                INDIE<br/>QUEST<br/>
                <span className="text-5xl">🎮</span>
              </h1>
            </div>
            
            <div className="bg-[#1a1a2e]/90 p-6 rounded-2xl border-2 border-[#b026ff]/40 backdrop-blur-md max-w-sm">
              <p className="text-gray-200 text-sm mb-4 font-semibold">
                This interactive quest takes about <span className="text-[#fee440]">5–7 minutes</span>.
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">
                All answers are anonymous and for academic research only.
              </p>
            </div>

            <ArcadeButton onClick={handleNext} color="teal" className="w-full max-w-xs scale-110">
              ▶ START GAME
            </ArcadeButton>
          </div>
        );

      case 1: // Screening Level
        return (
          <div className="p-6 pb-24">
            <HUDHeader title="Are you ready?" level="01" />
            <div className="pt-6 space-y-4">
              <Card title="Challenge 01" icon={Gamepad2} isComplete={formData.screening.playedIndie !== null}>
                <p className="text-white text-md font-bold mb-6">Have you ever played or watched gameplay of an Indonesian indie game?</p>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setFormData(p => ({...p, screening: {...p.screening, playedIndie: "Yes"}}))}
                    className={`py-3 rounded-xl border-2 font-bold transition-all ${formData.screening.playedIndie === "Yes" ? "bg-teal-500/20 border-teal-400 text-teal-400" : "bg-gray-900 border-gray-800 text-gray-500"}`}
                  >YES</button>
                  <button 
                    onClick={() => setFormData(p => ({...p, screening: {...p.screening, playedIndie: "No"}}))}
                    className={`py-3 rounded-xl border-2 font-bold transition-all ${formData.screening.playedIndie === "No" ? "bg-red-500/20 border-red-400 text-red-400" : "bg-gray-900 border-gray-800 text-gray-500"}`}
                  >NO</button>
                </div>
              </Card>

              <Card title="Challenge 02" icon={User} glow="purple" isComplete={formData.screening.activeGamer !== null}>
                <p className="text-white text-md font-bold mb-6">Do you consider yourself an active gamer?</p>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setFormData(p => ({...p, screening: {...p.screening, activeGamer: "Yes"}}))}
                    className={`py-3 rounded-xl border-2 font-bold transition-all ${formData.screening.activeGamer === "Yes" ? "bg-teal-500/20 border-teal-400 text-teal-400" : "bg-gray-900 border-gray-800 text-gray-500"}`}
                  >YES</button>
                  <button 
                    onClick={() => setFormData(p => ({...p, screening: {...p.screening, activeGamer: "No"}}))}
                    className={`py-3 rounded-xl border-2 font-bold transition-all ${formData.screening.activeGamer === "No" ? "bg-red-500/20 border-red-400 text-red-400" : "bg-gray-900 border-gray-800 text-gray-500"}`}
                  >NO</button>
                </div>
              </Card>

              <div className="p-4 bg-black/40 rounded-xl border border-dashed border-gray-700 flex items-center gap-4">
                {isScreenValid ? <Unlock className="text-teal-400" /> : <Lock className="text-gray-600" />}
                <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Only active players can unlock Level 1</p>
              </div>
            </div>
          </div>
        );

      case 2: // Player Profile
        return (
          <div className="p-6 pb-24">
            <HUDHeader title="Character Creation" level="02" />
            <div className="pt-6 space-y-6">
              <Card title="Global Identity" icon={User}>
                <label className="text-[9px] text-teal-400 uppercase font-bold mb-2 block">Country of Residence</label>
                <select 
                  value={formData.profile.country}
                  onChange={(e) => setFormData(p => ({...p, profile: {...p.profile, country: e.target.value}}))}
                  className="w-full bg-[#0d0221] border-2 border-teal-900 text-white rounded-xl p-4 outline-none focus:border-teal-400 transition-all font-bold"
                >
                  <option value="">Select Location...</option>
                  <option value="ID">Indonesia</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="JP">Japan</option>
                  <option value="AU">Australia</option>
                </select>
              </Card>

              <Card title="Vitals" icon={Layers} glow="purple">
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] text-[#b026ff] uppercase font-bold mb-3 block">Age Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Under 18', '18–24', '25–34', '35–44', '45+'].map(age => (
                        <button 
                          key={age}
                          onClick={() => setFormData(p => ({...p, profile: {...p.profile, age}}))}
                          className={`text-[10px] p-3 border-2 rounded-lg uppercase font-bold transition-all ${formData.profile.age === age ? "bg-[#b026ff]/20 border-[#b026ff] text-white" : "bg-gray-900 border-gray-800 text-gray-500"}`}
                        >{age}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <Card title="Equipment" icon={Monitor} glow="gold">
                <div className="space-y-6">
                  <div>
                    <label className="text-[9px] text-[#fee440] uppercase font-bold mb-3 block">Primary Platform</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['PC', 'Console', 'Mobile', 'Multiple'].map(plat => (
                        <button 
                          key={plat}
                          onClick={() => setFormData(p => ({...p, profile: {...p.profile, platform: plat}}))}
                          className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg text-[10px] uppercase font-bold transition-all ${formData.profile.platform === plat ? "bg-[#fee440]/20 border-[#fee440] text-white" : "bg-gray-900 border-gray-800 text-gray-500"}`}
                        >
                          {plat === 'PC' && <Monitor size={12}/>}
                          {plat === 'Console' && <Gamepad2 size={12}/>}
                          {plat === 'Mobile' && <Smartphone size={12}/>}
                          {plat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] text-[#fee440] uppercase font-bold mb-3 block">Playtime Per Week</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['<5 hours', '5–10 hours', '11–20 hours', '>20 hours'].map(time => (
                        <button 
                          key={time}
                          onClick={() => setFormData(p => ({...p, profile: {...p.profile, playtime: time}}))}
                          className={`text-[10px] p-3 border-2 rounded-lg uppercase font-bold transition-all ${formData.profile.playtime === time ? "bg-[#fee440]/20 border-[#fee440] text-white" : "bg-gray-900 border-gray-800 text-gray-500"}`}
                        >{time}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );

      case 3: // Level 1: Marketing
      case 4: // Level 2: E-WOM
      case 5: // Level 3: Innovation
      case 6: // Final Boss
        const configs = {
          3: { title: "LVL 1: MARKETING STRATEGY", key: "level1", glow: "teal", icon: Zap, questions: [
            "Promotional content is visually appealing",
            "Messages clearly communicate unique value",
            "Social media increases my awareness",
            "Digital platforms promote effectively",
            "Campaigns feel globally competitive"
          ]},
          4: { title: "LVL 2: DIGITAL WHISPERS", key: "level2", glow: "purple", icon: MessageSquare, questions: [
            "Online reviews influence my perception",
            "Positive comments increase interest",
            "Forums affect purchase consideration",
            "Influencers impact my trust",
            "User ratings influence my decision"
          ]},
          5: { title: "LVL 3: FORGE OF INNOVATION", key: "level3", glow: "gold", icon: Lightbulb, questions: [
            "Offers unique gameplay mechanics",
            "Visual art feels creative & distinctive",
            "Cultural elements add value",
            "Innovative vs mainstream indies",
            "Shows continuous innovation"
          ]},
          6: { title: "FINAL BOSS: THE DECISION", key: "finalBoss", glow: "red", icon: Skull, questions: [
            "Interested in future purchases",
            "Would pay if price is reasonable",
            "Willing to support by recommending",
            "Choose over other countries",
            "Intend to follow developers"
          ]}
        };
        const config = configs[screen];

        return (
          <div className="p-6 pb-24">
            <HUDHeader title={config.title} level={`0${screen}`} />
            <div className="pt-6 space-y-4">
              {screen === 6 && (
                <div className="relative mb-8 bg-black/60 p-6 rounded-2xl border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] flex flex-col items-center">
                  <div className="absolute -top-4 bg-red-600 px-3 py-1 rounded text-[10px] font-bold" style={{ fontFamily: '"Press Start 2P"' }}>BOSS FIGHT</div>
                  <div className="w-full h-4 bg-gray-900 rounded border border-gray-700 relative overflow-hidden">
                    <div className="h-full bg-red-600 shadow-[0_0_10px_#ef4444] transition-all duration-1000" style={{ width: '95%' }}></div>
                  </div>
                  <p className="mt-3 text-[9px] text-white tracking-widest font-bold">STAMINA: 95% COMPLETE</p>
                </div>
              )}
              
              <div className="bg-[#b026ff]/10 border border-[#b026ff]/40 p-4 rounded-xl flex items-center justify-between">
                <span className="text-[8px] text-gray-400 font-bold uppercase">1 = Disagree</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(n => <div key={n} className="w-1 h-1 bg-[#fee440] rounded-full"></div>)}
                </div>
                <span className="text-[8px] text-gray-400 font-bold uppercase">5 = Agree</span>
              </div>

              {config.questions.map((q, i) => (
                <Card key={i} title={`Objective 0${i+1}`} icon={config.icon} glow={config.glow} isComplete={formData[config.key][i] !== undefined}>
                  <p className="text-white text-md font-bold leading-tight">{q}</p>
                  <LikertHearts questionId={i} levelKey={config.key} />
                </Card>
              ))}
            </div>
          </div>
        );

      case 7: // End Screen
        return (
          <div className="flex flex-col items-center justify-center min-h-screen text-center p-8 space-y-10 bg-gradient-to-b from-[#0d0221] to-[#121225] animate-in zoom-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-[#fee440] blur-[80px] opacity-20 animate-pulse"></div>
              <Trophy size={100} className="text-[#fee440] drop-shadow-[0_0_25px_rgba(254,228,64,0.8)] relative z-10" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-2xl font-black text-white uppercase tracking-tighter" style={{ fontFamily: '"Press Start 2P"' }}>QUEST COMPLETED</h1>
              <p className="text-teal-400 font-bold tracking-widest uppercase text-sm">Achievement Unlocked: Master Contributor</p>
            </div>
            
            <div className="bg-[#1a1a2e]/90 p-8 rounded-3xl border-2 border-[#b026ff]/40 w-full max-w-sm">
              <p className="text-gray-300 text-sm leading-relaxed mb-8">
                Your tactical data has been uploaded to the research nexus. Thank you for your service to the Indie Quest.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-bold font-mono">
                  <span className="text-gray-500">FINAL XP</span>
                  <span className="text-[#fee440]">{xp + 500}</span>
                </div>
                <div className="w-full h-1 bg-gray-800 rounded-full">
                  <div className="w-full h-full bg-[#fee440]"></div>
                </div>
              </div>
            </div>

            <ArcadeButton onClick={() => window.location.reload()} color="gold" className="w-full max-w-xs scale-110">
              SUBMIT RESPONSE <CheckCircle2 size={16} className="ml-2" />
            </ArcadeButton>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0221] text-gray-100 font-sans selection:bg-[#00f5d4] selection:text-[#0d0221]">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Press+Start+2P&display=swap');
          
          body { background-color: #0d0221; margin: 0; }

          /* CRT Effect */
          .crt-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(rgba(18, 16, 33, 0) 50%, rgba(0, 0, 0, 0.15) 50%),
                        linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
            background-size: 100% 3px, 3px 100%;
            pointer-events: none;
            z-index: 100;
          }

          .scanline {
            width: 100%;
            height: 100px;
            z-index: 101;
            background: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0) 100%);
            opacity: 0.1;
            position: fixed;
            bottom: 100%;
            animation: scanline 8s linear infinite;
            pointer-events: none;
          }

          @keyframes scanline {
            0% { bottom: 100%; }
            100% { bottom: -100px; }
          }
        `}
      </style>

      <div className="crt-overlay"></div>
      <div className="scanline"></div>

      {/* Floating XP Toast */}
      {showXpToast && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[60] animate-bounce">
          <div className="bg-[#fee440] text-[#0d0221] px-5 py-3 rounded-xl font-bold shadow-[0_0_20px_#fee440] flex items-center gap-3 border-2 border-white/20" style={{ fontFamily: '"Press Start 2P"', fontSize: '10px' }}>
            <Zap size={16} fill="#0d0221" /> +100 XP GAINED
          </div>
        </div>
      )}

      {/* Validation Message */}
      {errorMsg && (
        <div className="fixed bottom-28 left-6 right-6 z-[60] animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-red-600/90 backdrop-blur-md text-white px-4 py-4 rounded-xl font-bold shadow-xl border-2 border-red-400 flex items-center gap-3">
            <AlertTriangle size={24} className="flex-shrink-0" />
            <p className="text-[10px] uppercase tracking-tighter" style={{ fontFamily: '"Press Start 2P"', lineHeight: '1.4' }}>{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-[450px] mx-auto min-h-screen relative shadow-2xl border-x border-white/5 bg-[#0d0221] overflow-hidden">
        {renderScreen()}

        {/* Persistent Footer Controls */}
        {screen > 0 && screen < 7 && (
          <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-6 pt-4 px-6 z-30 pointer-events-none">
            <div className="max-w-[450px] w-full flex gap-4 pointer-events-auto">
              <button 
                onClick={() => setScreen(p => p - 1)}
                className="bg-gray-800/80 backdrop-blur-md text-gray-400 p-4 rounded-xl border-2 border-gray-700 hover:text-white transition-all active:scale-95"
              >
                <ChevronRight size={24} className="rotate-180" />
              </button>
              <ArcadeButton 
                onClick={handleNext} 
                color={isScreenValid ? "teal" : "gray"} 
                disabled={!isScreenValid}
                className="flex-1"
              >
                {isScreenValid ? "NEXT LEVEL" : "LOCKED"} 
                {isScreenValid ? <ChevronRight size={16} className="ml-2" /> : <Lock size={16} className="ml-2" />}
              </ArcadeButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

