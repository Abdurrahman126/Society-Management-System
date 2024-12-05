'use client'

import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import HomeAnnouncementCard from './HomeAnnouncementCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ScrollingAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5001/api/announcements`);
        if (!response.ok) {
          throw new Error('Failed to fetch announcement data');
        }
        const data = await response.json();
        console.log(data);
        setAnnouncements(data);
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;

    const startAnimation = () => {
      stopAnimation();
      timeoutRef.current = setTimeout(() => {
        handleNavigation('next');
      }, 5000);
    };

    const stopAnimation = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    startAnimation();

    scrollContainer.addEventListener('mouseenter', stopAnimation);
    scrollContainer.addEventListener('mouseleave', startAnimation);

    return () => {
      stopAnimation();
      scrollContainer.removeEventListener('mouseenter', stopAnimation);
      scrollContainer.removeEventListener('mouseleave', startAnimation);
    };
  }, [activeIndex, announcements.length]);

  const handleNavigation = (direction) => {
    const scrollContainer = scrollRef.current;
    const nextIndex = direction === 'next' 
      ? (activeIndex + 1) % announcements.length 
      : (activeIndex - 1 + announcements.length) % announcements.length;
    
    setActiveIndex(nextIndex);

    scrollContainer.style.transition = 'transform 0.5s ease-in-out';
    scrollContainer.style.transform = `translateX(-${100 * nextIndex}%)`;
    
    setTimeout(() => {
      scrollContainer.style.transition = 'none';
      scrollContainer.style.transform = 'translateX(0)';
      scrollContainer.scrollLeft = 0;
    }, 500);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      handleNavigation('next');
    }, 5000);
  };

  return (
    <section className="py-16 relative bg-transparent">
      <div className="max-w-7xl mx-auto w-full px-4">
        <h2 className="text-4xl font-bold text-white mb-8 text-center">Latest Announcements</h2>
        <div className="relative">
          <button 
            onClick={() => handleNavigation('prev')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
            aria-label="Previous announcement"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <div 
            ref={scrollRef}
            className="flex overflow-hidden"
            style={{ 
              width: '100%',
              scrollSnapType: 'x mandatory',
            }}
          >
            {announcements.map((announcement, index) => (
              <div 
                key={announcement.id} 
                className="flex-shrink-0 w-full snap-center"
              >
                <HomeAnnouncementCard 
                  title={announcement.announcement_title}
                  content={announcement.content}
                  link={announcement.link}
                  isCenter={index === activeIndex}
                />
              </div>
            ))}
          </div>
          <button 
            onClick={() => handleNavigation('next')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
            aria-label="Next announcement"
          >
            <ChevronRight size={24} className="text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ScrollingAnnouncements;

