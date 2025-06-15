import React from 'react'
import { ReCaptcha } from '../ui/recapcha'
function Recapcha() {
    const handleVerification = (verified: boolean) => {
    
  };
  return (
    <div>
        <ReCaptcha onVerify={handleVerification} />
    </div>
  )
}

export default Recapcha