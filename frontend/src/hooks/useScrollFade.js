import { useState, useEffect } from "react";

export const useScrollFade = () => {
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [cafeOpacity, setCafeOpacity] = useState(0);
  const [stallsOpacity, setStallsOpacity] = useState(0);
  const [endOpacity, setEndOpacity] = useState(0);
  const [cafeContentVisible, setCafeContentVisible] = useState(false);
  const [stallsContentVisible, setStallsContentVisible] = useState(false);
  const [endContentVisible, setEndContentVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      const heroFade = Math.max(0, 1 - (scrollY / (vh * 0.6)));
      setHeroOpacity(heroFade);

      const cafeFadeIn = Math.min(1, Math.max(0, (scrollY - vh * 0.4) / (vh * 0.6)));
      const cafeFadeOut = Math.max(0, 1 - Math.max(0, (scrollY - vh * 1.4) / (vh * 0.6)));
      const cafeVal = Math.min(cafeFadeIn, cafeFadeOut);
      setCafeOpacity(cafeVal);
      setCafeContentVisible(cafeVal > 0.6);

      const stallsFadeIn = Math.min(1, Math.max(0, (scrollY - vh * 1.6) / (vh * 0.5)));
      const stallsFadeOut = Math.max(0, 1 - Math.max(0, (scrollY - vh * 2.4) / (vh * 0.6)));
      const stallsVal = Math.min(stallsFadeIn, stallsFadeOut);
      setStallsOpacity(stallsVal);
      setStallsContentVisible(stallsVal > 0.6);

      const endFadeIn = Math.min(1, Math.max(0, (scrollY - vh * 2.6) / (vh * 0.5)));
      setEndOpacity(endFadeIn);
      setEndContentVisible(endFadeIn > 0.6);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return {
    heroOpacity, cafeOpacity, stallsOpacity, endOpacity,
    cafeContentVisible, stallsContentVisible, endContentVisible,
  };
};