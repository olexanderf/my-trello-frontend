import React, { ReactElement } from 'react';
import './modal.scss';

type PropsType = {
  isVisibleModal: boolean;
  toggleModal: () => void;
};

export default function Modal(props: PropsType): ReactElement {
  const { isVisibleModal, toggleModal } = props;
  return (
    <div className={isVisibleModal ? 'modal-container' : 'modal-container hide'}>
      <div className="modal-content">
        <input className="modal-input" type="text" />
        <button
          className="modal-btn"
          onClick={(): void => {
            return toggleModal();
          }}
        >
          Добавить
        </button>
      </div>
    </div>
  );
}
