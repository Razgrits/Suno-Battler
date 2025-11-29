export enum SkillType {
  ATTACK = 'ATTACK',
  DEFENSE = 'DEFENSE',
  ULTIMATE = 'ULTIMATE',
}

export interface Skill {
  name: string;
  type: SkillType;
  description: string;
  power: number; // For dmg or shield amount
  effect?: string; // e.g., 'fire', 'stun', 'heal'
  cooldown: number; // Turns to wait
  currentCooldown: number;
}

export interface Monster {
  id: string;
  name: string;
  songUrl: string;
  coverUrl: string; // If found, otherwise placeholder
  audioUrl?: string; // If found
  maxHp: number;
  currentHp: number;
  attack: number;
  defense: number;
  agility: number;
  skills: Skill[];
  isDead: boolean;
}

export interface BattleLog {
  turn: number;
  message: string;
  type: 'info' | 'damage' | 'heal' | 'special';
}

export enum AppState {
  INPUT,
  GENERATING,
  BATTLE,
  GAME_OVER
}
