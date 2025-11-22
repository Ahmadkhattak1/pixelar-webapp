'use client';

import { useState, useEffect } from 'react';
import styles from './RotatingText.module.css';

interface RotatingTextProps {
    words: string[];
    interval?: number;
}

export default function RotatingText({ words, interval = 2500 }: RotatingTextProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % words.length);
                setIsAnimating(false);
            }, 300);
        }, interval);

        return () => clearInterval(timer);
    }, [words.length, interval]);

    return (
        <span className={`${styles.rotating} ${isAnimating ? styles.animating : ''}`}>
            {words[currentIndex]}
        </span>
    );
}
