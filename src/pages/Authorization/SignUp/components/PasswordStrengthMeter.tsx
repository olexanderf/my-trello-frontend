import React, { ReactElement } from 'react';
import './passwordStrengthMeter.scss';
import zxcvbn from 'zxcvbn';

interface PropsType {
  password: string;
}

export default function PasswordStrengthMeter(props: PropsType): ReactElement {
  const { password } = props;
  const passwordTestResult = zxcvbn(password);
  const passwordStrengthNumber = passwordTestResult.score;
  return (
    <div className="password-strength-progress">
      <div className={passwordStrengthNumber > 0 ? 'progress-bar short' : 'progress-bar'} />
      <div className={passwordStrengthNumber > 1 ? 'progress-bar weak' : 'progress-bar'} />
      <div className={passwordStrengthNumber > 2 ? 'progress-bar normal' : 'progress-bar'} />
      <div className={passwordStrengthNumber > 3 ? 'progress-bar strong' : 'progress-bar'} />
    </div>
  );
}
