import React, { ChangeEvent, ReactElement, useState } from 'react';
import { boardInputRegex } from '../../../common/constants/regExp';
import './modal.scss';

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
    if (e.target.value.match(boardInputRegex)) {
      setValidInput(true);
    } else {
      setValidInput(false);
    }
  };
  return (
    <div>
      <div className="modal-container" onClick={(e): void => e.stopPropagation()}>
        <div className="modal-content">
          <input
            className={isValidInput ? 'modal-input' : 'modal-input error'}
            type="text"
            onChange={handleChange}
            value={inputValue}
          />
          <button
            className={isValidInput ? 'modal-btn' : 'modal-btn-disabled'}
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
      <div className="grey" />
    </div>
  );
}
