import React, { Dispatch, ReactElement, SetStateAction, useEffect } from 'react';
import './passwordStrengthMeter.scss';
import zxcvbn from 'zxcvbn';

interface PropsType {
  password: string;
  setPasswordStrength: Dispatch<SetStateAction<number>>;
}

export default function PasswordStrengthMeter({ password, setPasswordStrength }: PropsType): ReactElement {
  const passwordTestResult = zxcvbn(password);
  const passwordStrengthNumber = passwordTestResult.score;
  useEffect(() => {
    setPasswordStrength(passwordStrengthNumber);
  }, [passwordStrengthNumber]);
  return (
    <div className="password-strength-progress">
      <div className={passwordStrengthNumber > 0 ? 'progress-bar short' : 'progress-bar'} />
      <div className={passwordStrengthNumber > 1 ? 'progress-bar weak' : 'progress-bar'} />
      <div className={passwordStrengthNumber > 2 ? 'progress-bar normal' : 'progress-bar'} />
      <div className={passwordStrengthNumber > 3 ? 'progress-bar strong' : 'progress-bar'} />
    </div>
  );
}
