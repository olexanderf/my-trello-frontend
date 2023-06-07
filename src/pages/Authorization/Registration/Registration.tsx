import React, { ChangeEvent, ReactElement, useState } from 'react';
import PasswordStrengthMeter from './components/PasswordStrengthMeter';
import './registration.scss';
import { checkValidEmail } from '../../../common/tools/validatorTools';

export default function Registration(): ReactElement {
  const [email, setEmailValue] = useState('');
  const [password, setPasswordValue] = useState('');
  const [confirmPassword, setConfirmPasswordValue] = useState('');
  const [isCorrectMail, setCorrectMail] = useState(true);
  const [isPasswordMatch, setPasswordMatch] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isPasswordStrong, setPasswordStrong] = useState(true);
  const [isSignUpPressed, setSignUpPress] = useState(false);

  const passwordValueHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    setPasswordValue(e.target.value);
    setPasswordStrong(passwordStrength >= 2);
  };
  const confirmPasswordValueHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    setConfirmPasswordValue(e.target.value);
    setPasswordMatch(password === e.target.value && e.target.value !== '');
  };
  const handleEmailInput = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmailValue(e.target.value);
    setCorrectMail(checkValidEmail(e.target.value));
  };
  const checkValidForm = (): boolean => {
    return (
      isCorrectMail && isPasswordMatch && isPasswordStrong && email !== '' && password !== '' && confirmPassword !== ''
    );
  };
  const signUp = (): void => {
    if (checkValidForm()) console.log(`email: ${email}, password: ${password}, confPassword ${confirmPassword}`);
  };
  return (
    <div className="authorization-page-box">
      <div className="authorization-page-container">
        <h1 className="authorization-page-title">Sign Up</h1>
        <form
          action=""
          id="registration-page-form"
          className="authorization-page-form"
          onSubmit={(e): void => {
            e.preventDefault();
            signUp();
            setSignUpPress(true);
          }}
        >
          <label htmlFor="registration-page-email">Enter your email</label>
          <input
            className="authorization-page-input"
            type="text"
            name="registration-page-email"
            id="registration-page-email"
            value={email}
            onChange={handleEmailInput}
          />
          {isSignUpPressed ? (
            <span className="authorization-page-error" hidden={isCorrectMail}>
              {email === '' ? 'Enter your email' : 'Please enter a valid email address'}
            </span>
          ) : (
            ''
          )}
          <label htmlFor="password">Create password</label>
          <input
            className="authorization-page-input"
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={passwordValueHandler}
          />
          <PasswordStrengthMeter password={password} setPasswordStrength={setPasswordStrength} />
          {isSignUpPressed ? (
            <span className="authorization-page-error" hidden={isPasswordStrong}>
              {password === '' ? 'Enter a password' : 'Password is weak'}
            </span>
          ) : (
            ''
          )}
          <label htmlFor="confirm-password">Confirm password</label>
          <input
            className="authorization-page-input"
            type="password"
            name="confirm-password"
            id="confirm-password"
            value={confirmPassword}
            onChange={confirmPasswordValueHandler}
          />
          {isSignUpPressed ? (
            <span className="authorization-page-error" hidden={isPasswordMatch}>
              {confirmPassword === '' ? 'Enter a comfirm password' : 'Those passwords didn`t match'}
            </span>
          ) : (
            ''
          )}
          <button type="submit" className="authorization-page-submit-btn">
            Register now
          </button>
          <span className="authorization-page-link">
            Already have an account? <a href="/login">Login</a>
          </span>
        </form>
      </div>
    </div>
  );
}
