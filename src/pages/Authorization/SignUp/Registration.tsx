import React, { ChangeEvent, ReactElement, useState } from 'react';
import PasswordStrengthMeter from './components/PasswordStrengthMeter';
import './registration.scss';

export default function Registration(): ReactElement {
  const [password, setPasswordValue] = useState('');
  const passwordValueHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    setPasswordValue(e.target.value);
  };
  return (
    <div className="registration-page-box">
      <div className="registration-page-container">
        <h1 className="registration-page-title">Регистрация</h1>
        <form
          action=""
          id="registration-page-form"
          onSubmit={(e): void => {
            e.preventDefault();
          }}
        >
          <label htmlFor="registration-page-email">Email</label>
          <input
            className="registration-page-input"
            type="text"
            name="registration-page-email"
            id="registration-page-email"
          />
          <label htmlFor="password">Пароль</label>
          <input
            className="registration-page-input"
            type="password"
            name="password"
            id="password"
            onChange={passwordValueHandler}
          />
          <PasswordStrengthMeter password={password} />
          <label htmlFor="confirm-password">Повторите пароль</label>
          <input className="registration-page-input" type="password" name="confirm-password" id="confirm-password" />
          <span className="registration-page-error-pswd">Пароли не совпадают!</span>
          <button type="submit" className="registration-page-submit-btn">
            Зарегистрироваться
          </button>
          <span className="registration-page-link">
            Уже есть аккаунт? <a href="/login"> Войти</a>
          </span>
        </form>
      </div>
    </div>
  );
}
