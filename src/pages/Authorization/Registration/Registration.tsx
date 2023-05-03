import React, { ChangeEvent, ReactElement, useState } from 'react';
import { emailRgx } from '../../../common/constants/regExp';
import PasswordStrengthMeter from './components/PasswordStrengthMeter';
import './registration.scss';

const checkValidEmail = (emailAddress: string): boolean => {
  if (emailAddress.match(emailRgx)) return true;
  return false;
};

export default function Registration(): ReactElement {
  const [email, setEmailValue] = useState('');
  const [password, setPasswordValue] = useState('');
  const [confirmPassword, setConfirmPasswordValue] = useState('');
  const [isCorrectMail, setCorrectMail] = useState(true);
  const [isPasswordMatch, setPasswordMatch] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isPasswordStrong, setPasswordStrong] = useState(true);

  const passwordValueHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    setPasswordValue(e.target.value);
  };
  const confirmPasswordValueHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    setConfirmPasswordValue(e.target.value);
  };
  const handleEmailInput = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmailValue(e.target.value);
  };
  const checkValidForm = (): boolean => {
    return (
      isCorrectMail && isPasswordMatch && isPasswordStrong && email !== '' && password !== '' && confirmPassword !== ''
    );
  };
  const signUp = (): void => {
    if (checkValidForm()) console.log(`email: ${email}, password: ${password}, comfPassword ${confirmPassword}`);
  };
  return (
    <div className="registration-page-box">
      <div className="registration-page-container">
        <h1 className="registration-page-title">Sign Up</h1>
        <form
          action=""
          id="registration-page-form"
          className="registration-page-form"
          onSubmit={(e): void => {
            e.preventDefault();
            signUp();
          }}
        >
          <label htmlFor="registration-page-email">Enter your email</label>
          <input
            className="registration-page-input"
            type="text"
            name="registration-page-email"
            id="registration-page-email"
            value={email}
            onChange={handleEmailInput}
            onBlur={(): void => setCorrectMail(checkValidEmail(email))}
          />
          <span className="registration-page-error" hidden={isCorrectMail}>
            {email === '' ? 'Enter your email' : 'Please enter a valid email address'}
          </span>
          <label htmlFor="password">Create password</label>
          <input
            className="registration-page-input"
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={passwordValueHandler}
            onBlur={(): void => setPasswordStrong(passwordStrength > 2)}
          />
          <PasswordStrengthMeter password={password} setPasswordStrength={setPasswordStrength} />
          <span className="registration-page-error" hidden={isPasswordStrong}>
            {password === '' ? 'Enter a password' : 'Use 8 or more characters'}
          </span>
          <label htmlFor="confirm-password">Confirm password</label>
          <input
            className="registration-page-input"
            type="password"
            name="confirm-password"
            id="confirm-password"
            value={confirmPassword}
            onChange={confirmPasswordValueHandler}
            onBlur={(): void => setPasswordMatch(password === confirmPassword && confirmPassword !== '')}
          />
          <span className="registration-page-error" hidden={isPasswordMatch}>
            {confirmPassword === '' ? 'Enter a password' : 'Those passwords didn`t match'}
          </span>
          <button type="submit" className="registration-page-submit-btn">
            Register now
          </button>
          <span className="registration-page-link">
            Already have an account? <a href="/login">Login</a>
          </span>
        </form>
      </div>
    </div>
  );
}
