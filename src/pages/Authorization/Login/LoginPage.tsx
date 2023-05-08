import React, { ChangeEvent, ReactElement, useState } from 'react';
import { checkValidEmail } from '../../../common/tools/validatorTools';

export default function LoginPage(): ReactElement {
  const [email, setEmailValue] = useState('');
  const [password, setPasswordValue] = useState('');
  const [isCorrectMail, setCorrectMail] = useState(true);
  const [isErrorResponse, setErrorResponse] = useState(false);
  const handleEmailInput = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmailValue(e.target.value);
  };
  const passwordValueHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    setPasswordValue(e.target.value);
  };
  return (
    <div className="authorization-page-box">
      <div className="authorization-page-container">
        <h1 className="authorization-page-title">Login</h1>
        <form
          action=""
          id="login-page-form"
          className="authorization-page-form"
          onSubmit={(e): void => {
            e.preventDefault();
          }}
        >
          <label htmlFor="authorization-page-email">Enter your email</label>
          <input
            className="authorization-page-input"
            type="text"
            name="registration-page-email"
            id="login-page-email"
            value={email}
            onChange={handleEmailInput}
            onBlur={(): void => setCorrectMail(checkValidEmail(email))}
          />
          <span className="authorization-page-error" hidden={isCorrectMail}>
            {email === '' ? 'Enter your email' : 'Please enter a valid email address'}
          </span>
          <label htmlFor="password">Enter password</label>
          <input
            className="authorization-page-input"
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={passwordValueHandler}
          />
          <span className="authorization-page-error" hidden={!isErrorResponse}>
            User with this password not found
          </span>
          <button type="submit" className="authorization-page-submit-btn">
            Login
          </button>
          <span className="authorization-page-link">
            Don`t have account? <a href="/registration">Registration</a>
          </span>
        </form>
      </div>
    </div>
  );
}
