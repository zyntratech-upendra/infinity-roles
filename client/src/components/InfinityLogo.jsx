import React from 'react';

const InfinityLogo = ({ 
  className = '', 
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  variant = 'default', // 'default' (The Infinity Roles Logo) | 'gradient' | 'square'
  alt = "The Infinity Roles"
}) => {
  const heightClasses = {
    sm: 'h-10 md:h-11',
    md: 'h-12 md:h-14',
    lg: 'h-16 md:h-20',
    xl: 'h-24 md:h-28'
  };

  // Safe, URL-friendly paths mapped directly to the authentic logos in the public folder
  // 'default' and 'gradient' use "The Infinity Roles Gradient Logo.png"
  const logoSrc = variant === 'plain' 
    ? '/The Infinity Roles Logo.png' 
    : '/The Infinity Roles Gradient Logo.png';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img 
        src={logoSrc} 
        alt={alt} 
        className={`${heightClasses[size] || heightClasses.md} w-auto object-contain transition-all duration-300 hover:scale-105 drop-shadow-sm`} 
        onError={(e) => {
          // Guaranteed fallback
          if (!e.target.dataset.fallbackTried) {
            e.target.dataset.fallbackTried = 'true';
            e.target.src = '/logo.png';
          }
        }}
      />
    </div>
  );
};

export default InfinityLogo;
