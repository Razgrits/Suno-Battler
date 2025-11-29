import React from 'react';
import { Monster, SkillType } from '../types';

interface MonsterDisplayProps {
  monster: Monster;
  isCurrentTurn: boolean;
  actionAnim: string | null;
  position: 'left' | 'right';
}

const MonsterDisplay: React.FC<MonsterDisplayProps> = ({ monster, isCurrentTurn, actionAnim, position }) => {
  const hpPercentage = Math.max(0, (monster.currentHp / monster.maxHp) * 100);
  
  // Placeholder logic if no image found
  const displayImage = monster.coverUrl && monster.coverUrl.length > 5 
    ? monster.coverUrl 
    : `https://picsum.photos/seed/${monster.name.replace(/\s/g, '')}/400/400`;

  const isVideo = displayImage.endsWith('.mp4');
  const isShake = actionAnim === 'damage';
  const isAttack = actionAnim === 'attack';

  // Layout logic:
  // Left Monster: [Skills] [Image/Stats] (Image is right-aligned in component, closer to center of screen)
  // Right Monster: [Image/Stats] [Skills] (Image is left-aligned in component, closer to center of screen)
  // Flex-row puts children in order. Flex-row-reverse puts them in reverse order.
  // Child 1: Skills Container. Child 2: Image Container.
  // Left: flex-row -> Skills | Image
  // Right: flex-row-reverse -> Image | Skills
  
  return (
    <div className={`
      flex items-center gap-4 transition-all duration-500
      ${position === 'left' ? 'flex-row text-right' : 'flex-row-reverse text-left'}
      ${isCurrentTurn ? 'scale-105 z-10' : 'scale-95 opacity-90'}
    `}>
      
      {/* SKILLS COLUMN */}
      <div className="w-48 flex-shrink-0 flex flex-col gap-2">
         {monster.skills.map((skill, i) => (
           <div key={i} className={`flex flex-col p-2 rounded-md border transition-colors duration-300 relative group
             ${skill.currentCooldown > 0 ? 'bg-gray-900 border-gray-700 opacity-60' : 'bg-card-bg border-white/10 hover:bg-white/10'}
           `}>
             <div className={`flex items-center mb-1 text-sm ${position === 'left' ? 'flex-row-reverse' : 'flex-row'}`}>
                <span className={`font-bold uppercase tracking-tighter leading-none
                    ${skill.type === SkillType.ATTACK ? 'text-red-400' : ''}
                    ${skill.type === SkillType.DEFENSE ? 'text-blue-400' : ''}
                    ${skill.type === SkillType.ULTIMATE ? 'text-neon-purple' : ''}
                `}>{skill.name}</span>
             </div>
             <p className="text-[10px] text-gray-400 leading-tight font-mono">{skill.description}</p>
             
             {skill.currentCooldown > 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded">
                    <span className="text-xs font-bold text-red-500">{skill.currentCooldown} TURN CD</span>
                </div>
             )}
           </div>
         ))}
      </div>

      {/* MAIN VISUAL COLUMN (Image, HP, Stats) */}
      <div className="w-56 flex-shrink-0 flex flex-col gap-2">
        
        {/* Name Header */}
        <div>
           <h2 className={`text-xl font-black uppercase tracking-tighter truncate leading-none ${position === 'left' ? 'text-neon-blue' : 'text-neon-pink'}`}>
            {monster.name}
           </h2>
           <div className={`text-xs font-mono text-gray-400 truncate`}>
             HP: {monster.currentHp}/{monster.maxHp}
           </div>
        </div>

        {/* HP Bar */}
        <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-white/20">
           <div 
             className="h-full bg-gradient-to-r from-green-600 to-emerald-400"
             style={{ width: `${hpPercentage}%`, transition: 'width 0.5s ease-out' }}
           />
        </div>

        {/* Image Container */}
        <div className={`relative aspect-square w-full rounded-lg overflow-hidden border-2 shadow-2xl bg-black
          ${position === 'left' ? 'border-neon-blue' : 'border-neon-pink'}
          ${isShake ? 'animate-shake border-red-500' : ''}
          ${isAttack ? (position === 'left' ? 'translate-x-8' : '-translate-x-8') : ''}
          transition-transform duration-200 ease-in-out
        `}>
          {isVideo ? (
            <video 
              src={displayImage}
              autoPlay
              loop
              muted
              playsInline
              className={`w-full h-full object-cover ${isShake ? 'opacity-50' : ''}`}
            />
          ) : (
            <img 
              src={displayImage} 
              alt={monster.name}
              className={`w-full h-full object-cover ${isShake ? 'opacity-50' : ''}`}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src.includes('.png')) {
                   target.src = target.src.replace('.png', '.jpeg');
                } else {
                   target.src = `https://picsum.photos/seed/${monster.id}/400/400`;
                }
              }}
            />
          )}
          
          {monster.isDead && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
              <span className="text-2xl font-black text-red-600 uppercase border-4 border-red-600 px-2 -rotate-12">
                DEFEATED
              </span>
            </div>
          )}
        </div>

        {/* Compact Stats Grid */}
        <div className="grid grid-cols-3 gap-1 bg-white/5 p-1 rounded border border-white/10 text-xs font-mono text-gray-300 text-center">
          <div>
            <div className="text-[9px] text-gray-500">ATK</div>
            <div className="text-red-300 font-bold">{monster.attack}</div>
          </div>
          <div>
            <div className="text-[9px] text-gray-500">DEF</div>
            <div className="text-blue-300 font-bold">{monster.defense}</div>
          </div>
          <div>
            <div className="text-[9px] text-gray-500">SPD</div>
            <div className="text-yellow-300 font-bold">{monster.agility}</div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default MonsterDisplay;