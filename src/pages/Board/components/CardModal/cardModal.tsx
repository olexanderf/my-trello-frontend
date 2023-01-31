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
    navigate(-1); // need fix to return on list page, not one step back
  };
  return (
    <div>
      <div className="card-modal-container">
        <div className="card-modal-container-main">
          <h1 className="card-modal-title">Title</h1>
          <span className="card-modal-list-name">
            В колонке: <span>List Name</span>
          </span>
          <div className="card-modal-members">
            <h4 className="card-modal-users-title">Участники:</h4>
            <div className="card-modal-users-container">
              <div className="card-modal-users-icon" />
              <div className="card-modal-users-icon" />
              <div className="card-modal-users-icon" />
              <button className="card-modal-users-icon-invite">+</button>
              <button className="card-modal-btn-join-member">Присоедениться</button>
            </div>
          </div>
          <div className="card-modal-description">
            <div className="card-modal-description-header-container">
              <h4 className="card-modal-description-header">Описание</h4>
              <button className="card-modal-description-btn-edit">Изменить</button>
            </div>
            <p className="card-modal-desctiption-text">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam in neque accusamus natus repellat
              repudiandae architecto cum doloremque quo rerum nostrum iste enim iure vero, veritatis fugiat quaerat quia
              laboriosam?
            </p>
          </div>
        </div>
        <div className="card-modal-actions-container">
          <h4 className="card-modal-actions-header">Действия</h4>
          <button className="card-modal-actions-btn">Копировать</button>
          <button className="card-modal-actions-btn">Перемещение</button>
          <button className="card-modal-actions-btn archive">Архивация</button>
        </div>
        <button className="card-modal-btn-close" onClick={(): void => onCardModalClose()}>
          +
        </button>
      </div>
      <div className="gray-background-box" />
    </div>
  );
}
