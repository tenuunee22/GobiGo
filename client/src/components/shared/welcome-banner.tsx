import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth-context';
interface WelcomeBannerProps {
  className?: string;
}
export function WelcomeBanner({ className = '' }: WelcomeBannerProps) {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('Сайн байна уу?');
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Өглөөний мэнд!');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Өдрийн мэнд!');
    } else {
      setGreeting('Оройн мэнд!');
    }
  }, []);
  const userName = user?.name || user?.displayName || '';
  const firstName = userName.split(' ')[0];
  const getInitials = (name: string) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };
  if (!user) return null;
  return (
    <motion.div 
      className={`p-4 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg shadow-lg text-white mb-6 overflow-hidden relative ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          <Avatar className="h-16 w-16 border-2 border-white">
            <AvatarImage src={user.photoURL || ''} alt={userName} />
            <AvatarFallback className="bg-blue-700 text-white text-lg">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
        </motion.div>
        <div className="ml-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold">{greeting}</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold mt-1">
              {firstName ? `${firstName} 👋` : 'Тавтай морил! 👋'}
            </h1>
          </motion.div>
        </div>
      </div>
      <motion.div 
        className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.3, 0.5] 
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      />
      <motion.div 
        className="absolute top-2 right-8 w-12 h-12 bg-white/10 rounded-full"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.2, 0.3] 
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          repeatType: 'reverse',
          delay: 1
        }}
      />
    </motion.div>
  );
}