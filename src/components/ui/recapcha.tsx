'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, RefreshCw, X, Shield } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';

interface ReCaptchaProps {
  onVerify: (verified: boolean) => void;
  theme?: 'light' | 'dark';
  size?: 'normal' | 'compact';
}

type ChallengeType = 'checkbox' | 'image' | 'math' | 'pattern';

interface ImageChallenge {
  id: number;
  url: string;
  isCorrect: boolean;
}

interface MathChallenge {
  question: string;
  answer: number;
  options: number[];
}

interface PatternChallenge {
  sequence: string[];
  answer: string;
  options: string[];
}

export function ReCaptcha({ onVerify, theme = 'light', size = 'normal' }: ReCaptchaProps) {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeType, setChallengeType] = useState<ChallengeType>('checkbox');
  const [attempts, setAttempts] = useState(0);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [mathAnswer, setMathAnswer] = useState<number | null>(null);
  const [patternAnswer, setPatternAnswer] = useState<string>('');

  // Sample data for challenges
  const imageChallenge: ImageChallenge[] = [
    { id: 1, url: 'https://images.pexels.com/photos/170811/cars-audi-auto-automotive-170811.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1', isCorrect: true },
    { id: 2, url: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1', isCorrect: false },
    { id: 3, url: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1', isCorrect: true },
    { id: 4, url: 'https://images.pexels.com/photos/1386604/pexels-photo-1386604.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1', isCorrect: false },
    { id: 5, url: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1', isCorrect: true },
    { id: 6, url: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1', isCorrect: false },
    { id: 7, url: 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1', isCorrect: true },
    { id: 8, url: 'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1', isCorrect: false },
    { id: 9, url: 'https://images.pexels.com/photos/193999/pexels-photo-193999.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1', isCorrect: true }
  ];

  const mathChallenge: MathChallenge = {
    question: "What is 7 + 15?",
    answer: 22,
    options: [18, 22, 25, 20]
  };

  const patternChallenge: PatternChallenge = {
    sequence: ["🔴", "🔵", "🔴", "🔵", "🔴", "?"],
    answer: "🔵",
    options: ["🔴", "🔵", "🟡", "🟢"]
  };

  const handleCheckboxClick = () => {
    if (isVerified) return;
    
    setIsLoading(true);
    
    // Simulate verification process
    setTimeout(() => {
      const shouldShowChallenge = Math.random() > 0.3; // 70% chance of challenge
      
      if (shouldShowChallenge) {
        const challenges: ChallengeType[] = ['image', 'math', 'pattern'];
        const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
        setChallengeType(randomChallenge);
        setShowChallenge(true);
        setIsLoading(false);
      } else {
        setIsVerified(true);
        setIsLoading(false);
        onVerify(true);
      }
    }, 1500);
  };

  const handleImageSelect = (imageId: number) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleChallengeSubmit = () => {
    let isCorrect = false;

    switch (challengeType) {
      case 'image':
        const correctImages = imageChallenge.filter(img => img.isCorrect).map(img => img.id);
        isCorrect = selectedImages.length === correctImages.length && 
                   selectedImages.every(id => correctImages.includes(id));
        break;
      case 'math':
        isCorrect = mathAnswer === mathChallenge.answer;
        break;
      case 'pattern':
        isCorrect = patternAnswer === patternChallenge.answer;
        break;
    }

    if (isCorrect) {
      setIsVerified(true);
      setShowChallenge(false);
      onVerify(true);
    } else {
      setAttempts(prev => prev + 1);
      if (attempts >= 2) {
        // Reset after 3 failed attempts
        setShowChallenge(false);
        setAttempts(0);
        onVerify(false);
      }
      // Reset selections for retry
      setSelectedImages([]);
      setMathAnswer(null);
      setPatternAnswer('');
    }
  };

  const handleRefresh = () => {
    setShowChallenge(false);
    setIsVerified(false);
    setAttempts(0);
    setSelectedImages([]);
    setMathAnswer(null);
    setPatternAnswer('');
    onVerify(false);
  };

  const containerClasses = size === 'compact' ? 'w-64' : 'w-80';
  const isDark = theme === 'dark';

  if (showChallenge) {
    return (
      <Card className={`${containerClasses} ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Shield className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                Verify you're human
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className={`p-1 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          {attempts > 0 && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
              Incorrect. Please try again. ({3 - attempts} attempts remaining)
            </div>
          )}

          {/* Image Challenge */}
          {challengeType === 'image' && (
            <div>
              <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Select all images with <strong>cars</strong>
              </p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {imageChallenge.map((image) => (
                  <div
                    key={image.id}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImages.includes(image.id)
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleImageSelect(image.id)}
                  >
                    <img
                      src={image.url}
                      alt={`Challenge image ${image.id}`}
                      className="w-full h-16 object-cover"
                    />
                    {selectedImages.includes(image.id) && (
                      <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-blue-600 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Math Challenge */}
          {challengeType === 'math' && (
            <div>
              <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Solve this math problem:
              </p>
              <div className={`text-lg font-semibold mb-4 text-center p-3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                {mathChallenge.question}
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {mathChallenge.options.map((option) => (
                  <button
                    key={option}
                    // variant={mathAnswer === option ? "default" : "outline"}
                    onClick={() => setMathAnswer(option)}
                    className="h-12"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pattern Challenge */}
          {challengeType === 'pattern' && (
            <div>
              <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Complete the pattern:
              </p>
              <div className={`flex items-center justify-center space-x-2 mb-4 p-3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                {patternChallenge.sequence.map((item, index) => (
                  <span key={index} className="text-2xl">
                    {item}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {patternChallenge.options.map((option) => (
                  <button
                    key={option}
                    // variant={patternAnswer === option ? "default" : "outline"}
                    onClick={() => setPatternAnswer(option)}
                    className="h-12 text-xl"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleChallengeSubmit}
            disabled={
              (challengeType === 'image' && selectedImages.length === 0) ||
              (challengeType === 'math' && mathAnswer === null) ||
              (challengeType === 'pattern' && patternAnswer === '')
            }
            className="w-full"
          >
            Verify
          </button>

          {/* Footer */}
          <div className={`text-xs mt-3 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="flex items-center justify-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>reCAPTCHA</span>
            </div>
            <div className="mt-1">
              <a href="#" className="hover:underline">Privacy</a>
              <span className="mx-1">-</span>
              <a href="#" className="hover:underline">Terms</a>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${containerClasses} ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          {/* Checkbox */}
          <div
            className={`relative w-6 h-6 border-2 rounded cursor-pointer transition-all duration-200 flex items-center justify-center ${
              isVerified
                ? 'bg-green-500 border-green-500'
                : isLoading
                ? 'border-blue-500'
                : `border-gray-300 hover:border-gray-400 ${isDark ? 'border-gray-600 hover:border-gray-500' : ''}`
            }`}
            onClick={handleCheckboxClick}
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
            ) : isVerified ? (
              <CheckCircle2 className="w-4 h-4 text-white" />
            ) : null}
          </div>

          {/* Label */}
          <span className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'} select-none`}>
            I'm not a robot
          </span>

          {/* Logo */}
          <div className="flex-1 flex justify-end">
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span className="font-medium">reCAPTCHA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className={`text-xs mt-3 text-right ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <a href="#" className="hover:underline">Privacy</a>
          <span className="mx-1">-</span>
          <a href="#" className="hover:underline">Terms</a>
        </div>
      </CardContent>
    </Card>
  );
}