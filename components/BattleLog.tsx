import React, { useEffect, useRef } from 'react';
import { BattleLog as LogType } from '../types';

interface BattleLogProps {
  logs: LogType[];
}

const BattleLog: React.FC<BattleLogProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="w-full h-48 bg-black/50 border-t border-white/10 overflow-y-auto p-4 font-mono text-sm shadow-inner rounded-b-xl">
      <div className="flex flex-col gap-2">
        {logs.map((log, idx) => (
          <div key={idx} className={`
            px-2 py-1 rounded border-l-2
            ${log.type === 'info' ? 'border-gray-500 text-gray-400' : ''}
            ${log.type === 'damage' ? 'border-red-500 text-red-200 bg-red-900/10' : ''}
            ${log.type === 'heal' ? 'border-green-500 text-green-200 bg-green-900/10' : ''}
            ${log.type === 'special' ? 'border-yellow-500 text-yellow-200 bg-yellow-900/10' : ''}
          `}>
            <span className="text-xs opacity-50 mr-2">[{log.turn}]</span>
            {log.message}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default BattleLog;
