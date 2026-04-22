import React from 'react';
import { motion } from 'motion/react';
import { skills } from '../data/cv';
import { useLanguage } from '../contexts/LanguageContext';

export const Skills = () => {
  const { getStr } = useLanguage();

  // Continually floating animation variance
  const getFloatingAnimation = (index: number) => ({
    y: [-3, 3, -3],
    transition: {
      duration: 3 + (index % 3), // Varied duration
      repeat: Infinity,
      ease: "easeInOut",
      delay: index * 0.1 // Staggered start
    }
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <section id="skills" className="py-20 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-10 text-white tracking-tight">
          {getStr({ en: "Skills", vi: "Kỹ năng" })}
          <span className="text-blue-500">.</span>
        </h2>

        <motion.div 
          className="flex flex-wrap gap-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              variants={item}
              className="relative group cursor-default"
            >
              {/* Inner animated wrapper for the floating effect so the hover pop effect doesn't conflict */}
              <motion.div 
                animate={getFloatingAnimation(index)}
              >
                <motion.div
                  whileHover={{ y: -5, scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-gray-200 font-medium transition-colors shadow-lg overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 -translate-x-[100%] group-hover:translate-x-[100%] transition-all duration-700 pointer-events-none" />
                  <span className="relative z-10">{skill}</span>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};
