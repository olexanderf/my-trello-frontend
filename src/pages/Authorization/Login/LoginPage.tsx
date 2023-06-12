import React, { ChangeEvent, ReactElement, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppState } from '../../../store/store';
import { login } from '../../../store/modules/user/actions';

export default function LoginPage(): ReactElement {
  const [email, setEmailValue] = useState('');
  const [password, setPasswordValue] = useState('');
  const [isFromSubmit, toggleSubmitForm] = useState(false);
  const loginErrorMassage = useSelector((state: AppState) => state.errorMessage.loginErrorMassage);
  const dispatch: AppDispatch = useDispatch();
  const handleEmailInput = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmailValue(e.target.value);
  };
  const passwordValueHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    setPasswordValue(e.target.value);
  };
  const checkNoEmptyInput = (): boolean => {
    return password !== '' && email !== '';
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
            toggleSubmitForm(true);
            if (checkNoEmptyInput()) dispatch(login(email, password));
          }}
        >
          <label htmlFor="login-page-email">Enter your email</label>
          <input
            className="authorization-page-input"
            type="text"
            name="authorization-page-email"
            id="login-page-email"
            value={email}
            onChange={handleEmailInput}
          />
          {isFromSubmit ? (
            <span className="authorization-page-error" hidden={email !== ''}>
              Please enter a email address
            </span>
          ) : (
            ''
          )}
          <label htmlFor="password">Enter password</label>
          <input
            className="authorization-page-input"
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={passwordValueHandler}
          />
          {isFromSubmit ? (
            <span className="authorization-page-error" hidden={password !== ''}>
              Please enter a password
            </span>
          ) : (
            ''
          )}
          <span className="authorization-page-error" hidden={loginErrorMassage === ''}>
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
