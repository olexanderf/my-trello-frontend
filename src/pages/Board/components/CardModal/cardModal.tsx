import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleCardEditModal } from '../../../../store/modules/cardEditModal/action';
import { AppDispatch } from '../../../../store/store';
import './cardModal.scss';

export default function CardModal(props): JSX.Element {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const onCardModalClose = (): void => {
    dispatch(toggleCardEditModal(false));
    navigate(-1);
  };
  return (
    <div>
      <div className="card-modal-container">
        <h1 className="card-modal-title">Title</h1>
        <h3 className="card-modal-list-name">List Name</h3>
        <div className="card-modal-members">
          <div className="card-modal-users-icon">user</div>
          <div className="card-modal-users-icon">user</div>
          <div className="card-modal-users-icon">user</div>
          <div className="card-modal-users-icon-invite">+</div>
          <button className="card-modal-join-member">Присоедениться</button>
        </div>
        <div className="card-modal-description">
          <button className="card-modal-description-btn-edit">Изменить</button>
        </div>
        <div className="card-modal-actions-container">
          <button className="card-modal-actions-copy">Копировать</button>
          <button className="card-modal-actions-moving">Перемещение</button>
          <button className="card-modal-actions-copy-archive">Архивация</button>
        </div>
        <button className="card-modal-btn-close" onClick={(): void => onCardModalClose()}>
          +
        </button>
      </div>
      <div className="grey" />
    </div>
  );
}
