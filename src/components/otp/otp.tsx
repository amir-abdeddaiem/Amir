
"use client"; // Required for Next.js 13+ (since we're using hooks)

import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import styles from './OTPInput.module.css'; // Optional CSS (see below)

const OTP_LENGTH = 6; // Change this for different OTP lengths

const OTPInput = () => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus the first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Handle OTP change
  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/\D/g, ''); // Allow only digits
    if (value && !/^\d+$/.test(value)) return; // Prevent non-digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only the last digit (if pasted)
    setOtp(newOtp);

    // Auto-focus next input if a digit was entered
    if (value && index < OTP_LENGTH - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace to move focus backward
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste (e.g., from SMS autofill)
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '');
    if (pastedData.length === OTP_LENGTH) {
      const newOtp = [...otp];
      for (let i = 0; i < OTP_LENGTH; i++) {
        newOtp[i] = pastedData[i] || '';
      }
      setOtp(newOtp);
      inputRefs.current[OTP_LENGTH - 1]?.focus(); // Focus last input after paste
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    alert(`OTP Submitted: ${otpCode}`); // Replace with your logic (e.g., API call)
  };

  return (
    <div className={styles.container}>
      <h2>Enter OTP</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.otpContainer}>
          {Array.from({ length: OTP_LENGTH }).map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={otp[index]}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              ref={(el) => { inputRefs.current[index] = el; }}
              className={styles.otpInput}
              inputMode="numeric"
              autoComplete="one-time-code" // Helps with autofill on mobile
            />
          ))}
        </div>
        <button type="submit" className={styles.submitButton}>
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default OTPInput;