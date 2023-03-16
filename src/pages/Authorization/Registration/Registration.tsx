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
    if (
      isCorrectMail &&
      isPasswordMatch &&
      isPasswordStrong &&
      email !== '' &&
      password !== '' &&
      confirmPassword !== ''
    )
      return true;
    return false;
  };
  const signUp = (): void => {
    // if (
    //   isCorrectMail &&
    //   isPasswordMatch &&
    //   isPasswordStrong &&
    //   email !== '' &&
    //   password !== '' &&
    //   confirmPassword !== ''
    // ) {
    console.log(`email: ${email}, password: ${password}, comfPassword ${confirmPassword}`);
    // }
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
            setPasswordMatch(password === confirmPassword && confirmPassword !== '');
            setCorrectMail(checkValidEmail(email));
            setPasswordStrong(passwordStrength > 2);
            if (checkValidForm()) signUp();
          }}
        >
          <label htmlFor="registration-page-email">Email</label>
          <input
            className="registration-page-input"
            type="text"
            name="registration-page-email"
            id="registration-page-email"
            value={email}
            onChange={handleEmailInput}
          />
          <span className="registration-page-error" hidden={isCorrectMail}>
            {email === '' ? 'Это поле должно быть заполнено ' : 'Email не корректный'}
          </span>
          <label htmlFor="password">Пароль</label>
          <input
            className="registration-page-input"
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={passwordValueHandler}
          />
          <PasswordStrengthMeter password={password} setPasswordStrength={setPasswordStrength} />
          <span className="registration-page-error" hidden={isPasswordStrong}>
            {password === '' ? 'Это поле должно быть заполнено ' : 'Пароли слишком простой'}
          </span>
          <label htmlFor="confirm-password">Повторите пароль</label>
          <input
            className="registration-page-input"
            type="password"
            name="confirm-password"
            id="confirm-password"
            value={confirmPassword}
            onChange={confirmPasswordValueHandler}
          />
          <span className="registration-page-error" hidden={isPasswordMatch}>
            {confirmPassword === '' ? 'Это поле должно быть заполнено ' : 'Пароли не совпадают'}
          </span>
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
