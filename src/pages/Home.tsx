import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, archiveUser, unarchiveUser, hideUser } from '../store/userSlice';
import { RootState, AppDispatch } from '../store/store';
import UserCard from '../components/UserCard';
// import Posts from '../components/Posts';

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeUsers, archivedUsers, loading, error } = useSelector(
    (state: RootState) => state.users
  );

  const [animating, setAnimating] = useState<number | null>(null);

  // Загрузка пользователей
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Архивирование пользователя
  const handleArchiveUser = (id: number) => {
    setAnimating(id);
    setTimeout(() => {
      dispatch(archiveUser(id));
      setAnimating(null);
    }, 300);
  };

  // Скрытие пользователя
  const handleHideUser = (id: number) => {
    dispatch(hideUser(id));
  };

  // Возстановление пользователя
  const handleUnarchiveUser = (id: number) => {
    setAnimating(id);
    setTimeout(() => {
      dispatch(unarchiveUser(id));
      setAnimating(null);
    }, 500);
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
            className={animating === user.id ? 'archiving' : ''}
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
              className={animating === user.id ? 'restoring' : ''}
            />
          ))}
        </div>
      </div>

      <div className='container-posts'>
      {/* <Posts /> */}
    </div>
    </div>
   
  );
};

export default HomePage;