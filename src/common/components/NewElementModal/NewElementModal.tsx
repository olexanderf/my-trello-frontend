import React, { ChangeEvent, ReactElement, useState } from 'react';
import { boardInputRegex } from '../../constants/regExp';
import './newElementModal.scss';

type PropsType = {
  toggleModal: () => void;
  handleValueModal: (title: string) => void;
  handleClickCreateElement: () => void;
};

export default function Modal(props: PropsType): ReactElement {
  const [inputValue, setValue] = useState('');
  const [isValidInput, setValidInput] = useState(true);
  const { toggleModal, handleValueModal, handleClickCreateElement } = props;
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
    handleValueModal(e.target.value);
    setValidInput(!!e.target.value.match(boardInputRegex));
  };
  return (
    <div>
      <div className="modal-container" onClick={(e): void => e.stopPropagation()}>
        <div className="content">
          <input
            className={isValidInput ? 'modal-input' : 'modal-input error-board'}
            type="text"
            onChange={handleChange}
            value={inputValue}
          />
          <button
            className={isValidInput ? 'modal-btn' : 'modal-btn disabled'}
            onClick={(): void => {
              if (isValidInput) {
                handleClickCreateElement();
                setValue('');
                toggleModal();
              }
            }}
          >
            Добавить
          </button>
          <button className="modal-btn-close" onClick={(): void => toggleModal()}>
            +
          </button>
        </div>
      </div>
      <div className="gray-background-box" onClick={(): void => toggleModal()} />
    </div>
  );
}
