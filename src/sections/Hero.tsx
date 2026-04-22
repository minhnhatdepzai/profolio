import React from 'react';
import { motion } from 'motion/react';
import { personalInfo } from '../data/cv';
import { useLanguage } from '../contexts/LanguageContext';
import { Github, Mail, Phone, ExternalLink, Facebook, Youtube, ChevronDown } from 'lucide-react';

export const Hero = () => {
  const { getStr, lang } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  const nameChars = personalInfo.name.split('');
  const titleText = getStr(personalInfo.title);

  return (
    <section id="hero" className="min-h-[100dvh] flex flex-col justify-center items-center py-20 px-6 relative overflow-hidden">
      {/* Background blobs with infinite floating animation */}
      <motion.div 
        animate={{ 
          x: [0, 30, -20, 0], 
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.9, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          x: [0, -40, 30, 0], 
          y: [0, 30, -30, 0],
          scale: [1, 0.8, 1.2, 1]
        }}
        transition={{ duration: 18, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" 
      />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto text-center z-10"
      >
        <motion.div 
          variants={itemVariants}
          className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-8 rounded-full border-4 border-white/10 overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.3)] relative bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center text-4xl font-bold"
        >
          <img 
            src="https://scontent.fsgn5-15.fna.fbcdn.net/v/t39.30808-6/678667908_942776498664563_516502120670198218_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=13d280&_nc_eui2=AeHm54p1rdICI0P_VdkMsP93-LMI-Sayb8r4swj5JrJvypcvz277TMo2Cin5Gjt18CBrosl35ElBN3G_GQmeGhFK&_nc_ohc=LFLRukKDdwIQ7kNvwHdZ6CE&_nc_oc=AdqIfCrzxXu2v_AlmVaF9nX54yDKAfdtflfTAJ40J3EMrQfapXd1XvsjTX72roIHBFI&_nc_zt=23&_nc_ht=scontent.fsgn5-15.fna&_nc_gid=EmDMStAw0mK-zKzGIZtamg&_nc_ss=7b3a8&oh=00_Af3yvjhZiKi5XtKAmx_LpZaEpOyWbyT0v4Sd8FZH2tynYA&oe=69EED7A4" 
            alt="Lê Minh Nhật" 
            className="w-full h-full object-cover" 
            referrerPolicy="no-referrer" 
          />
        </motion.div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-4 flex justify-center flex-wrap">
          {nameChars.map((char, index) => (
            <motion.span 
              key={index} 
              variants={itemVariants}
              className={char === ' ' ? 'mr-3' : ''}
            >
              {char}
            </motion.span>
          ))}
        </h1>
        <motion.h2 
          key={titleText} // Re-animate on language change
          variants={itemVariants}
          custom={titleText}
          initial="hidden"
          animate="show"
          className="text-xl md:text-3xl text-blue-400 font-medium mb-8 h-10"
        >
          {titleText.split('').map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.1, delay: 0.5 + index * 0.03 }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h2>

        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 text-sm md:text-base text-gray-300">
          <a href={`tel:${personalInfo.phone}`} className="group flex items-center gap-2 hover:text-white transition-all hover:scale-105 bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10">
            <Phone size={16} className="group-hover:animate-bounce" /> {personalInfo.phone}
          </a>
          <a href={`mailto:${personalInfo.email}`} className="group flex items-center gap-2 hover:text-white transition-all hover:scale-105 bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10">
            <Mail size={16} className="group-hover:animate-bounce" /> {personalInfo.email}
          </a>
          <a href={personalInfo.facebook} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 hover:text-white transition-all hover:scale-105 bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10">
            <Facebook size={16} className="group-hover:animate-bounce" /> Facebook <ExternalLink size={14} className="ml-1 opacity-50" />
          </a>
          <a href={personalInfo.youtube} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 hover:text-white transition-all hover:scale-105 bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10">
            <Youtube size={16} className="group-hover:animate-bounce" /> YouTube <ExternalLink size={14} className="ml-1 opacity-50" />
          </a>
          <a href={personalInfo.githubLink} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 hover:text-white transition-all hover:scale-105 bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10">
            <Github size={16} className="group-hover:animate-bounce" /> {personalInfo.github} <ExternalLink size={14} className="ml-1 opacity-50" />
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 flex flex-col items-center gap-2 text-gray-500"
      >
        <span className="text-xs uppercase tracking-widest">{lang === 'vi' ? 'Cuộn xuống' : 'Scroll Down'}</span>
        <motion.div
           animate={{ y: [0, 8, 0] }}
           transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={20} className="text-blue-500/50" />
        </motion.div>
      </motion.div>

    </section>
  );
};
