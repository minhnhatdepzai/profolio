import React from 'react';
import { motion } from 'motion/react';
import { experience } from '../data/cv';
import { useLanguage } from '../contexts/LanguageContext';

export const Experience = () => {
  const { getStr } = useLanguage();

  return (
    <section id="experience" className="py-20 px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-white tracking-tight">
          {getStr({ en: "Experience", vi: "Kinh nghiệm" })}
          <span className="text-blue-500">.</span>
        </h2>

        <div className="space-y-12">
          {experience.map((exp, index) => (
            <div key={index} className="relative pl-8 md:pl-0 group">
              {/* Animated Timeline Line */}
              <motion.div 
                className="hidden md:block absolute left-0 top-0 w-px bg-blue-500"
                initial={{ height: 0 }}
                whileInView={{ height: '100%' }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: 0.2 }}
              />
              
              <div className="md:pl-10 relative">
                {/* Animated Timeline dot */}
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                  className="absolute left-[-2rem] md:left-[-5px] top-2 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" 
                />
                
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mb-2"
                >
                  <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold text-blue-400 bg-blue-400/10 rounded-full border border-blue-400/20">
                    {getStr(exp.period)}
                  </span>
                  <h3 className="text-2xl font-bold text-white tracking-tight mb-1">{getStr(exp.role)}</h3>
                  <h4 className="text-lg text-gray-400 font-medium mb-6">{exp.company}</h4>
                </motion.div>

                <ul className="space-y-4">
                  {exp.responsibilities.map((resp, idx) => (
                    <motion.li 
                      key={idx} 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.4, delay: 0.5 + (idx * 0.1) }}
                      className="flex gap-3 text-gray-300 hover:text-white transition-colors"
                    >
                      <span className="text-blue-500 mt-1.5">•</span>
                      <span className="leading-relaxed">{getStr(resp)}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
