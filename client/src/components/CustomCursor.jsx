import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  // Array of trail particles for a soft, light smoke trail
  const [smokeParticles, setSmokeParticles] = useState([]);
  const particleIdRef = useRef(0);
  const lastEmitRef = useRef(0);

  // Smooth springs for leading cursor ring
  const springConfig = { damping: 28, stiffness: 320, mass: 0.4 };
  const smoothX = useSpring(-200, springConfig);
  const smoothY = useSpring(-200, springConfig);

  useEffect(() => {
    // Only enable on pointer/desktop devices
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const updateMouse = (e) => {
      const { clientX, clientY } = e;
      setMousePosition({ x: clientX, y: clientY });
      smoothX.set(clientX);
      smoothY.set(clientY);
      if (!isVisible) setIsVisible(true);

      // Detect clickable / interactive elements
      const target = e.target;
      const isInteractive = target && (
        target.closest('button') || 
        target.closest('a') || 
        target.closest('input') || 
        target.closest('select') || 
        target.closest('textarea') || 
        target.closest('[role="button"]') ||
        window.getComputedStyle(target).cursor === 'pointer'
      );
      setIsPointer(!!isInteractive);

      // Emit subtle, soft light smoke puff throttled (every ~45ms)
      const now = performance.now();
      if (now - lastEmitRef.current > 45) {
        lastEmitRef.current = now;
        particleIdRef.current += 1;
        const newParticle = {
          id: particleIdRef.current,
          x: clientX,
          y: clientY,
          size: Math.random() * 12 + 16, // soft puff size 16px - 28px
          offsetX: (Math.random() - 0.5) * 8,
          offsetY: (Math.random() - 0.5) * 8,
        };
        setSmokeParticles((prev) => [...prev.slice(-14), newParticle]);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', updateMouse);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', updateMouse);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, smoothX, smoothY]);

  // Clean up smoke particles as they expire
  useEffect(() => {
    if (smokeParticles.length === 0) return;
    const timer = setTimeout(() => {
      setSmokeParticles((prev) => prev.slice(1));
    }, 450);
    return () => clearTimeout(timer);
  }, [smokeParticles]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden md:block">
      
      {/* Light Smoke Puff Trail (Soft white/indigo tints with fade & expand) */}
      {smokeParticles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0.28, scale: 0.6 }}
          animate={{ opacity: 0, scale: 1.8, y: -12 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="fixed rounded-full pointer-events-none"
          style={{
            left: p.x + p.offsetX,
            top: p.y + p.offsetY,
            width: p.size,
            height: p.size,
            marginLeft: -(p.size / 2),
            marginTop: -(p.size / 2),
            backgroundColor: 'rgba(99, 102, 241, 0.12)',
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.15)',
            filter: 'blur(4px)',
          }}
        />
      ))}

      {/* Outer fluid trailing ring with light solid border */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-indigo-500/60 pointer-events-none"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isClicking ? 30 : isPointer ? 44 : 28,
          height: isClicking ? 30 : isPointer ? 44 : 28,
          backgroundColor: isPointer ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.03)',
          borderColor: isPointer ? '#4f46e5' : '#818cf8',
        }}
        transition={{ type: 'spring', damping: 22, stiffness: 360 }}
      />

      {/* Center pinpoint light indigo dot */}
      <div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-indigo-600 pointer-events-none"
        style={{
          transform: `translate3d(${mousePosition.x - 4}px, ${mousePosition.y - 4}px, 0)`,
          transition: 'transform 0.03s linear',
        }}
      />
    </div>
  );
};

export default CustomCursor;
