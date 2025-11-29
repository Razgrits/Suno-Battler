import React, { useState, useEffect, useCallback } from 'react';
import { Monster, AppState, BattleLog as LogType, Skill, SkillType } from './types';
import { generateMonsters } from './services/geminiService';
import InputForm from './components/InputForm';
import MonsterDisplay from './components/MonsterDisplay';
import BattleLog from './components/BattleLog';
import AudioController from './components/AudioController';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [turnCount, setTurnCount] = useState(0);
  const [logs, setLogs] = useState<LogType[]>([]);
  const [winner, setWinner] = useState<Monster | null>(null);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [actionAnim, setActionAnim] = useState<{ id: string, type: 'attack' | 'damage' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async (data: { 
    url1: string; title1: string; theme1: string; cover1: string; lyrics1: string;
    url2: string; title2: string; theme2: string; cover2: string; lyrics2: string;
  }) => {
    setIsLoading(true);
    try {
      const generatedMonsters = await generateMonsters(data);
      setMonsters(generatedMonsters);
      const firstIndex = generatedMonsters[0].agility >= generatedMonsters[1].agility ? 0 : 1;
      setCurrentTurnIndex(firstIndex);
      setLogs([{ turn: 0, message: "BATTLE INITIATED!", type: 'info' }]);
      setAppState(AppState.BATTLE);
    } catch (e) {
      alert("Failed to generate monsters. Please check the links.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const addLog = (message: string, type: LogType['type']) => {
    setLogs(prev => [...prev, { turn: turnCount, message, type }]);
  };

  const processTurn = useCallback(() => {
    if (appState !== AppState.BATTLE || !monsters.length || winner) return;

    const attackerIdx = currentTurnIndex;
    const defenderIdx = attackerIdx === 0 ? 1 : 0;
    
    const newMonsters = [...monsters];
    const attacker = { ...newMonsters[attackerIdx] };
    const defender = { ...newMonsters[defenderIdx] };

    let skill: Skill;
    const availableSkills = attacker.skills.filter(s => s.currentCooldown === 0);
    const ultimate = availableSkills.find(s => s.type === SkillType.ULTIMATE);
    
    if (ultimate) {
      skill = ultimate;
    } else {
      skill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
    }

    if (!skill) {
        skill = { name: "Struggle", type: SkillType.ATTACK, power: 10, cooldown: 0, description: "Basic hit", currentCooldown: 0 };
    }

    let logMsg = `${attacker.name} uses ${skill.name}!`;

    if (skill.type === SkillType.ATTACK || skill.type === SkillType.ULTIMATE) {
        const rawDmg = skill.power + (attacker.attack * 0.5) - (defender.defense * 0.25);
        const variance = (Math.random() * 0.2) + 0.9; 
        const damage = Math.floor(Math.max(1, rawDmg * variance));
        
        defender.currentHp -= damage;
        logMsg += ` It deals ${damage} damage!`;
        if (skill.effect) logMsg += ` Effect: ${skill.effect}`;

        setActionAnim({ id: attacker.id, type: 'attack' });
        setTimeout(() => {
            setActionAnim({ id: defender.id, type: 'damage' });
        }, 200);

    } else if (skill.type === SkillType.DEFENSE) {
        const healAmount = Math.floor(skill.power * 0.8 + (attacker.attack * 0.2));
        attacker.currentHp = Math.min(attacker.maxHp, attacker.currentHp + healAmount);
        logMsg += ` Restores ${healAmount} HP!`;
        setActionAnim({ id: attacker.id, type: 'attack' });
    }

    attacker.skills = attacker.skills.map(s => ({
        ...s,
        currentCooldown: s.name === skill.name ? s.cooldown : Math.max(0, s.currentCooldown - 1)
    }));

    newMonsters[attackerIdx] = attacker;
    newMonsters[defenderIdx] = defender;

    setMonsters(newMonsters);
    addLog(logMsg, skill.type === SkillType.DEFENSE ? 'heal' : (skill.type === SkillType.ULTIMATE ? 'special' : 'damage'));

    if (defender.currentHp <= 0) {
        defender.currentHp = 0;
        defender.isDead = true;
        setMonsters(newMonsters);
        setWinner(attacker);
        setAppState(AppState.GAME_OVER);
        addLog(`${defender.name} has been defeated! ${attacker.name} wins!`, 'special');
    } else {
        setTimeout(() => {
            setActionAnim(null);
            setTurnCount(prev => prev + 1);
            setCurrentTurnIndex(defenderIdx);
        }, 1500);
    }

  }, [appState, monsters, currentTurnIndex, winner]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (appState === AppState.BATTLE && !winner) {
       timeout = setTimeout(() => {
         processTurn();
       }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [appState, winner, turnCount, processTurn]);

  return (
    <div className="h-screen flex flex-col bg-dark-bg text-white font-sans overflow-hidden">
      
      {/* Scrollable Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="container mx-auto px-4 py-6 max-w-7xl min-h-full flex flex-col justify-center">
          
          {appState === AppState.INPUT || appState === AppState.GENERATING ? (
            <div className="flex items-center justify-center h-full">
              <InputForm onSubmit={handleStart} isLoading={isLoading} />
            </div>
          ) : (
            <div className="flex flex-col h-full gap-4">
              
              {/* Top Bar: Turn & Reset */}
              <div className="flex justify-between items-center px-4">
                 <h1 className="text-xl font-bold tracking-widest text-gray-500">TURN {turnCount}</h1>
                 {winner && (
                    <button 
                        onClick={() => {
                            setAppState(AppState.INPUT);
                            setMonsters([]);
                            setLogs([]);
                            setWinner(null);
                            setTurnCount(0);
                        }}
                        className="px-4 py-2 bg-white text-black text-sm font-bold rounded hover:bg-gray-200 transition-colors uppercase"
                    >
                        New Battle
                    </button>
                 )}
              </div>

              {/* Arena: Centered and Compact */}
              <div className="flex-1 flex flex-col justify-center items-center">
                <div className="w-full flex justify-center items-center gap-4 md:gap-12">
                   {/* Left Monster */}
                   <MonsterDisplay 
                     monster={monsters[0]} 
                     position="left" 
                     isCurrentTurn={currentTurnIndex === 0 && !winner}
                     actionAnim={actionAnim?.id === monsters[0].id ? actionAnim.type : null}
                   />
                   
                   {/* VS Badge */}
                   <div className="flex flex-col items-center justify-center shrink-0">
                      <div className="text-5xl font-black italic text-white/10 select-none">VS</div>
                      {winner && (
                        <div className="mt-2 px-3 py-1 bg-neon-purple text-white text-xs font-bold rounded animate-pulse">
                            WINNER
                        </div>
                      )}
                   </div>

                   {/* Right Monster */}
                   <MonsterDisplay 
                     monster={monsters[1]} 
                     position="right"
                     isCurrentTurn={currentTurnIndex === 1 && !winner}
                     actionAnim={actionAnim?.id === monsters[1].id ? actionAnim.type : null}
                   />
                </div>
              </div>

              {/* Battle Log (Fixed Height) */}
              <div className="shrink-0 mb-4">
                  <BattleLog logs={logs} />
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Fixed Music Bar at Bottom */}
      {(appState === AppState.BATTLE || appState === AppState.GAME_OVER) && monsters.length === 2 && (
        <AudioController 
            monster1={monsters[0]} 
            monster2={monsters[1]} 
            isBattleActive={true} 
        />
      )}
    </div>
  );
};

export default App;