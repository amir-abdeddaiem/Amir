import React, { useState, useRef, useEffect } from 'react';

interface OTPInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  showMailAlert?: boolean;
  email?: string;
}

const OTPInput: React.FC<OTPInputProps> = ({ 
  length = 6, 
  onComplete = () => {},
  showMailAlert = false,
  email = ''
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const [isVerified, setIsVerified] = useState(false);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    // Reset verification state when OTP changes
    if (isVerified && otp.some(digit => digit === '')) {
      setIsVerified(false);
    }
  }, [otp, isVerified]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Check if all fields are filled
    if (newOtp.every(digit => digit !== '')) {
      setIsVerified(true);
      onComplete(newOtp.join(''));
    }

    // Move to next input if current input is filled
    if (value && index < length - 1) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = inputRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').slice(0, length);
    const pasteArray = pasteData.split('').filter(char => !isNaN(Number(char)));
    
    if (pasteArray.length === length) {
      setOtp(pasteArray);
      setIsVerified(true);
      onComplete(pasteArray.join(''));
      const lastInput = inputRefs.current[length - 1];
      if (lastInput) {
        lastInput.focus();
      }
    }
  };

  return (
    <div className="space-y-4">
      {showMailAlert && (
        <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-md mb-4">
          A verification code has been sent to <span className="font-medium">{email || 'your email'}</span>
        </div>
      )}
      
      <div className="flex items-center justify-center space-x-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            ref={(el) => {
              if (el) inputRefs.current[index] = el;
            }}
            className={`w-12 h-12 text-2xl text-center border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
              isVerified && otp.every(d => d !== '')
                ? 'border-green-500 bg-green-50 focus:ring-green-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
        ))}
      </div>

      {isVerified && otp.every(d => d !== '') && (
        <div className="text-green-600 text-sm text-center mt-2 flex items-center justify-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Code verified!
        </div>
      )}
    </div>
  );
};

export default OTPInput;