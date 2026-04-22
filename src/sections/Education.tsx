import React from 'react';
import { motion } from 'motion/react';
import { education, certificates } from '../data/cv';
import { useLanguage } from '../contexts/LanguageContext';
import { GraduationCap, Award } from 'lucide-react';

export const Education = () => {
  const { getStr } = useLanguage();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, x: -30, rotateX: 20 },
    show: { opacity: 1, x: 0, rotateX: 0, transition: { type: "spring", stiffness: 80 } }
  };

  return (
    <section id="education" className="py-20 px-6 max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12">
        
        {/* Education Half */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-10">
            <GraduationCap className="text-blue-500" size={32} />
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              {getStr({ en: "Education", vi: "Học vấn" })}
            </h2>
          </div>

          <motion.div 
            className="space-y-6 perspective-1000"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {education.map((edu, idx) => (
              <motion.div 
                key={idx} 
                variants={itemAnim}
                whileHover={{ scale: 1.02, rotateY: 2, rotateX: -2 }}
                className="p-6 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all origin-left"
              >
                <span className="text-sm font-medium text-blue-400 mb-2 block">{edu.period}</span>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{getStr(edu.school)}</h3>
                <p className="text-gray-400">{getStr(edu.degree)}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Certificates Half */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-10">
            <Award className="text-blue-500" size={32} />
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              {getStr({ en: "Certificates", vi: "Chứng chỉ" })}
            </h2>
          </div>

          <motion.div 
            className="space-y-6 perspective-1000"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {certificates.map((cert, idx) => (
              <motion.div 
                key={idx}
                variants={itemAnim}
                whileHover={{ scale: 1.02, rotateY: -2, rotateX: -2 }}
                className="p-6 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all origin-left"
              >
                <span className="text-sm font-medium text-purple-400 mb-2 block">{cert.period}</span>
                <h3 className="text-xl font-bold text-white">{getStr(cert.name)}</h3>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};
