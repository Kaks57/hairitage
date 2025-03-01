import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', onClick }) => {
  const sizeClasses = {
    sm: 'text-xl md:text-2xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-3xl md:text-4xl'
  };

  return (
    <Link 
      to="/" 
      onClick={onClick}
      className={`font-serif font-bold ${sizeClasses[size]} text-gradient flex items-center transition-transform duration-300 hover:scale-105`}
    >
      <img src="/logo.webp" alt="Heritage Logo" className="w-8 h-8 mr-2" />
      <div className="relative">
        <span className="flex items-center">

        </span>
        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-heritage-purple to-heritage-dark-purple transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
      </div>
      <span className="ml-2 font-light text-sm md:text-base tracking-wider text-heritage-dark-gray">HERITAGE</span>
    </Link>
  );
};

export default Logo;