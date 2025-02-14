import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, archiveUser, unarchiveUser, hideUser } from '../store/userSlice';
import { RootState, AppDispatch } from '../store/store';
import UserCard from '../components/UserCard';

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); 
  const { activeUsers, archivedUsers, loading, error } = useSelector(
    (state: RootState) => state.users
  );

  // Загрузка пользователей
  useEffect(() => {
    dispatch(fetchUsers()); 
  }, [dispatch]);

  // Архивирование пользователя
  const handleArchiveUser = (id: number) => {
    dispatch(archiveUser(id)); 
  };

  // Скрытие пользователя
  const handleHideUser = (id: number) => {
    dispatch(hideUser(id));
  };

  // Возстановление пользователя
  const handleUnarchiveUser = (id: number) => {
    dispatch(unarchiveUser(id)); 
  };

  // Загрузка, если данные загружаются
  if (loading) {
    return <div>Loading...</div>;
  }

  // Ошибка при получении данных 
  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  
  return (
    <div className="container">
      <h1 className='titleH1'>Активные</h1>
      <div className="user-active">
        {activeUsers.map(user => (
          <UserCard
            key={user.id}
            user={user} 
            onArchive={handleArchiveUser} 
            onHide={handleHideUser} 
          />
        ))}
      </div>

      <div className="user-cards-archived">
        <h1 className='titleH1'>Архив</h1>
        <div className="user-archived">
          {archivedUsers.map(user => (
            <UserCard
              key={user.id} 
              user={user} 
              onArchive={handleArchiveUser}
              onHide={handleHideUser} 
              onUnarchive={handleUnarchiveUser} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;