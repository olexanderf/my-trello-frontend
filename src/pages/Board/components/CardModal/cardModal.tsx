import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CardModal(props): JSX.Element {
  const navigate = useNavigate();
  return (
    <div>
      <div className="card-modal-container">
        <h1 className="card-modal-title">Title</h1>
        <h3 className="card-modal-list-name">List Name</h3>
        <div className="card-modal-members">
          <div className="card-modal-users-icon">user</div>
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
        <button className="card-modal-btn-close" onClick={(): void => navigate(-1)}>
          +
        </button>
      </div>
    </div>
  );
}
