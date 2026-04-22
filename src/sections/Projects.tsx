import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { projects } from '../data/cv';
import { useLanguage } from '../contexts/LanguageContext';
import { Github, ExternalLink, PlayCircle, Search, X } from 'lucide-react';

export const Projects = () => {
  const { getStr, lang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract tag frequencies for tag cloud
  const tagStats = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach(category => {
      category.items.forEach(item => {
        if (item.tags) {
          item.tags.forEach(tag => {
            counts[tag] = (counts[tag] || 0) + 1;
          });
        }
      });
    });
    
    const stats = Object.entries(counts).map(([tag, count]) => ({ tag, count }));
    const max = Math.max(...stats.map(s => s.count), 1);
    const min = Math.min(...stats.map(s => s.count), 0);
    // Sort tags alphabetically for the cloud, or by count. Alphabetical usually looks more like a cloud.
    return { stats: stats.sort((a, b) => a.tag.localeCompare(b.tag)), max, min };
  }, []);

  const getTagStyle = (count: number, isSelected: boolean) => {
    const { min, max } = tagStats;
    const ratio = max === min ? 0.5 : (count - min) / (max - min);
    // Font size ranges from 12px to 24px
    const fontSize = 12 + ratio * 12;
    // Base opacity ranges from 0.6 to 1
    const opacity = isSelected ? 1 : 0.6 + ratio * 0.4;
    
    return {
      fontSize: `${fontSize}px`,
      opacity,
    };
  };

  const filteredProjects = projects.map(category => {
    const filteredItems = category.items.filter(item => {
      const name = getStr(item.name).toLowerCase();
      const desc = getStr(item.desc).toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch = name.includes(query) || desc.includes(query);
      const matchesTag = selectedTag ? item.tags?.includes(selectedTag) : true;
      return matchesSearch && matchesTag;
    });
    return { ...category, items: filteredItems };
  }).filter(category => category.items.length > 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <section id="projects" className="py-20 px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="mb-10"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
          {getStr({ en: "Projects", vi: "Dự án" })}
          <span className="text-blue-500">.</span>
        </h2>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-12"
      >
        <div className="relative max-w-md mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-500" />
          </div>
          <input 
            type="text" 
            placeholder={lang === 'vi' ? "Tìm kiếm dự án..." : "Search projects..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500/50 text-white placeholder:text-gray-500 transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Tag Cloud Filter */}
        <div className="flex flex-wrap items-center justify-center gap-3 p-6 bg-white/5 border border-white/10 rounded-3xl">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedTag === null
                ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] md:hover:scale-105'
                : 'bg-black/30 text-gray-400 hover:text-white hover:bg-white/10 md:hover:scale-105'
            }`}
          >
            {lang === 'vi' ? "Tất cả dự án" : "All Projects"}
          </button>
          
          <div className="w-px h-8 bg-white/10 mx-2 hidden md:block" />
          
          {tagStats.stats.map(({ tag, count }) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              style={getTagStyle(count, selectedTag === tag)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 leading-none md:hover:scale-110 ${
                selectedTag === tag
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                  : 'bg-transparent text-gray-300 border border-white/10 hover:border-white/30 hover:bg-white/10 hover:text-white hover:!opacity-100'
              }`}
              title={`${count} project${count > 1 ? 's' : ''}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </motion.div>

      {filteredProjects.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 text-gray-500 bg-white/5 rounded-3xl border border-white/5"
        >
          <p>{lang === 'vi' ? "Không tìm thấy dự án nào phù hợp." : "No projects found matching your search."}</p>
        </motion.div>
      )}

      <div className="space-y-20">
        {filteredProjects.map((category, catIdx) => (
          <div key={category.category.en}>
            <h3 className="text-2xl font-bold text-gray-400 mb-8 pb-4 border-b border-white/10 uppercase tracking-widest text-sm">
              {getStr(category.category)}
            </h3>
            
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
            >
              <AnimatePresence mode="popLayout">
                {category.items.map((project) => (
                  <motion.div
                    key={project.name.en}
                    layout="position"
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-6 rounded-3xl flex flex-col hover:border-blue-500/30 hover:shadow-[0_10px_30px_rgba(59,130,246,0.1)] transition-all group"
                  >
                    <div className="flex-1 mb-6">
                      <h4 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-blue-400 transition-colors">{getStr(project.name)}</h4>
                      
                      {/* Project Tags */}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.tags.map((tag, tIdx) => (
                            <span key={tIdx} className="text-[10px] font-semibold text-gray-400 bg-black/50 px-2 py-1 rounded-md border border-white/5 group-hover:border-white/20 transition-colors">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-gray-400 text-sm leading-relaxed">
                        {getStr(project.desc)}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mt-auto pt-4 border-t border-white/5 group-hover:border-white/10 transition-colors">
                      {project.links?.map((link, lIdx) => (
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          key={lIdx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-medium text-gray-300 hover:text-white bg-black/40 px-3 py-1.5 rounded-full"
                        >
                          {link.label.toLowerCase().includes('github') || link.label.toLowerCase().includes('repo') ? (
                            <Github size={14} />
                          ) : (
                            <ExternalLink size={14} />
                          )}
                          {link.label}
                        </motion.a>
                      ))}
                      {project.demos?.map((demo, dIdx) => (
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          key={dIdx}
                          href={demo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-medium text-blue-300 hover:text-blue-100 bg-blue-500/20 px-3 py-1.5 rounded-full"
                        >
                          <PlayCircle size={14} />
                          {demo.label}
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
};
