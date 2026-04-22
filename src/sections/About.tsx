import React from 'react';
import { motion } from 'motion/react';
import { personalInfo } from '../data/cv';
import { useLanguage } from '../contexts/LanguageContext';

export const About = () => {
  const { getStr } = useLanguage();
  const text = getStr(personalInfo.profile);
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.2 * i },
    }),
  };

  const child = {
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: "spring", damping: 12, stiffness: 100 } },
    hidden: { opacity: 0, y: 20, filter: 'blur(5px)' },
  };

  return (
    <section id="about" className="py-20 px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-10 text-white tracking-tight">
          {getStr({ en: "About", vi: "Giới thiệu" })}
          <span className="text-blue-500">.</span>
        </h2>
        
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm relative overflow-hidden group">
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute top-0 left-0 w-2 bg-blue-500" 
          />
          <motion.div
            className="absolute -inset-x-20 -inset-y-20 bg-blue-500/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
          />
          
          <motion.p 
             key={text} // Re-animate on language switch
             className="text-lg md:text-xl text-gray-300 leading-relaxed relative flex flex-wrap"
             variants={container}
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, margin: "-50px" }}
          >
            {words.map((word, index) => (
              <motion.span variants={child} key={index} className="mr-2 mb-1">
                {word}
              </motion.span>
            ))}
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
};
