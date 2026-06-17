import React from 'react';
import { motion } from 'framer-motion';

export interface VideoGreetingProps {
  videoUrl: string;
  posterUrl?: string;
}

export const VideoGreeting: React.FC<VideoGreetingProps> = ({ videoUrl, posterUrl }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-4xl mx-auto my-12 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10 bg-black"
    >
      <div className="aspect-video w-full">
        {videoUrl.includes('loom.com') ? (
          <iframe 
            src={videoUrl.replace('/share/', '/embed/')}
            frameBorder="0"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        ) : (
          <video 
            src={videoUrl} 
            poster={posterUrl} 
            controls 
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="bg-white dark:bg-agency-dark p-4 md:p-6 text-center border-t border-gray-200 dark:border-white/10">
        <h3 className="text-lg font-bold text-agency-dark dark:text-white mb-1">A Personal Message for You</h3>
        <p className="text-sm text-agency-subtext dark:text-white/60">Watch this 2-minute walkthrough before reading the proposal.</p>
      </div>
    </motion.div>
  );
};
