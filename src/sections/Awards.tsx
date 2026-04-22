import React from 'react';
import { motion } from 'motion/react';
import { prizes } from '../data/cv';
import { useLanguage } from '../contexts/LanguageContext';
import { Trophy } from 'lucide-react';

export const Awards = () => {
  const { getStr } = useLanguage();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, x: -50, scale: 0.8 },
    show: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <section id="awards" className="py-20 px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center gap-4 mb-12">
          <motion.div
            initial={{ rotate: -20, scale: 0 }}
            whileInView={{ rotate: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", bounce: 0.6, duration: 1, delay: 0.2 }}
            whileHover={{ rotate: [0, -10, 10, -10, 10, 0], transition: { duration: 0.5 } }}
          >
            <Trophy className="text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" size={48} />
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            {getStr({ en: "Prizes & Awards", vi: "Giải thưởng" })}
          </h2>
        </div>

        <motion.div 
          className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-yellow-500/5 blur-[100px] rounded-full pointer-events-none" />
          
          <ul className="space-y-6 relative z-10">
            {prizes.map((prize, idx) => (
              <motion.li 
                key={idx}
                variants={itemAnim}
                whileHover={{ x: 10 }}
                className="flex gap-5 items-start p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-default"
              >
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + idx * 0.1, type: "spring" }}
                    className="w-3 h-3 rounded-full bg-yellow-400" 
                  />
                </div>
                <p className="text-gray-300 md:text-lg leading-relaxed pt-1">
                  {getStr(prize)}
                </p>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
};
