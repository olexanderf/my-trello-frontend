import React, { ChangeEvent, ReactElement, useState } from 'react';
import { boardInputRegex } from '../../../common/constants/regExp';
import './modal.scss';

type PropsType = {
  isVisibleModal: boolean;
  toggleModal: () => void;
  handleValueModal: (title: string) => void;
  handleClickCreateElement: () => void;
};

export default function Modal(props: PropsType): ReactElement {
  const [inputValue, setValue] = useState('');
  const [isValidInput, setValidInput] = useState(true);
  const { isVisibleModal, toggleModal, handleValueModal, handleClickCreateElement } = props;
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setValue(e.target.value);
    handleValueModal(e.target.value);
  };
  return (
    <div
      className={isVisibleModal ? 'modal-container active' : 'modal-container'}
      onClick={(e): void => e.stopPropagation()}
    >
      <div className="modal-content">
        <textarea
          className={isValidInput ? 'modal-input' : 'modal-input error'}
          type="text"
          onChange={handleChange}
          value={inputValue}
        />
        <button
          className="modal-btn"
          onClick={(): void => {
            if (inputValue.match(boardInputRegex)) {
              setValidInput(true);
              handleClickCreateElement();
              setValue('');
              toggleModal();
            } else {
              setValidInput(false);
            }
          }}
        >
          Добавить
        </button>
      </div>
    </div>
  );
}
