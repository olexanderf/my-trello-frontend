import React, { ChangeEvent, ReactElement, useState } from 'react';
import { boardInputRegex } from '../../../../common/constants/regExp';
import './modal.scss';

type PropsType = {
  isVisibleModal: boolean;
  toggleModal: () => void;
  handleValueModal: (title: string) => void;
  handleClickCreateBoard: () => void;
};

export default function Modal(props: PropsType): ReactElement {
  const [inputValue, setValue] = useState('');
  const { isVisibleModal, toggleModal, handleValueModal, handleClickCreateBoard } = props;
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
    handleValueModal(e.target.value);
  };
  return (
    <div className={isVisibleModal ? 'modal-container active' : 'modal-container'}>
      <div className="modal-content">
        <input
          className={inputValue.match(boardInputRegex) ? 'modal-input' : 'modal-input error'}
          type="text"
          onChange={handleChange}
        />
        <button
          className="modal-btn"
          onClick={(): void => {
            if (inputValue.match(boardInputRegex)) {
              handleClickCreateBoard();
              setValue('');
            } 
            toggleModal();
          }}
        >
          Добавить
        </button>
      </div>
    </div>
  );
}