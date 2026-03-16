import React from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface KeyboardProps {
  activeKey?: string;
  showNumeric?: boolean;
}

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ç'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', ';']
];

const NUMERIC = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'];

export const VirtualKeyboard: React.FC<KeyboardProps> = ({ activeKey, showNumeric }) => {
  const getKeyColor = (key: string) => {
    if (activeKey?.toUpperCase() === key.toUpperCase()) {
      return 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-110 z-10 font-black';
    }
    return 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 shadow-sm font-bold';
  };

  return (
    <div className="flex flex-col gap-2 p-6 md:p-10 w-full max-w-6xl mx-auto bg-zinc-100/50 dark:bg-zinc-900/50 rounded-[40px] border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-md shadow-2xl">
      <div className="flex gap-4 md:gap-8 w-full justify-center">
        <div className="flex flex-col gap-3 w-full">
          {ROWS.map((row, i) => (
            <div 
              key={i} 
              className="flex gap-2 md:gap-3 justify-center w-full"
            >
              <div style={{ width: `${i * 3}%` }} className="hidden sm:block" />
              {row.map(key => (
                <motion.div
                  key={key}
                  className={cn(
                    "flex-1 max-w-[4rem] md:max-w-[5rem] aspect-square min-h-[48px] flex items-center justify-center rounded-2xl border-b-4 text-lg md:text-xl transition-all",
                    getKeyColor(key)
                  )}
                >
                  {key}
                </motion.div>
              ))}
              <div style={{ width: `${(2 - i) * 3}%` }} className="hidden sm:block" />
            </div>
          ))}
          <div className="flex justify-center mt-2 w-full">
            <motion.div
              className={cn(
                "w-full max-w-2xl h-14 md:h-16 flex items-center justify-center rounded-2xl border-b-4 text-lg md:text-xl tracking-widest transition-all",
                getKeyColor(' ')
              )}
            >
              ESPAÇO
            </motion.div>
          </div>
        </div>

        {showNumeric && (
          <div className="grid grid-cols-3 gap-2 md:gap-3 border-l-2 border-zinc-200 dark:border-zinc-800 pl-4 md:pl-8">
            {NUMERIC.map((key, idx) => (
              <motion.div
                key={idx}
                className={cn(
                  "w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-2xl border-b-4 text-xl transition-all",
                  getKeyColor(key)
                )}
              >
                {key}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
