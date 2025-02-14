import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';
import { User } from '../types/User';

interface UserCardProps {
  user: User; 
  onArchive: (id: number) => void; 
  onHide: (id: number) => void; 
  onUnarchive?: (id: number) => void; 
}

const UserCard: React.FC<UserCardProps> = ({ user, onArchive, onHide, onUnarchive }) => {
  const [menuOpen, setMenuOpen] = useState(false); 
  const menuRef = useRef<HTMLDivElement | null>(null); 

  // Функция для переключения состояния меню
  const toggleMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation(); 
    setMenuOpen(!menuOpen); 
  };

  // Функция для обработки клика по элементу меню
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false); 
      }
    };

    document.addEventListener('mousedown', handleClickOutside); 
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); 
    };
  }, []);

  return (
    <div className="user-card">
      <div className="user-card-overlay">
        <img src="./src/assets/avatar.jpg" alt="Avatar" className="user-avatar" />
      </div>
      <div className="user-info">
        <div className='title-group'>
          <h1>{user.username}</h1> 
          <h2>{user.company.name}</h2> 
        </div>
        <p>{user.address.city}</p>
        <div className="user-actions">
          <div onClick={toggleMenu} className="buttonMenu">
            <MoreVertical /> 
          </div>
          {menuOpen && (
            <div ref={menuRef} className="menu">
              <ul>
                <li>
                  <Link to={`/edit/${user.id}`}>Редактировать</Link>
                </li>
                {user.isArchived ? (
                  <li onClick={() => onUnarchive?.(user.id)}>Восстановить</li> 
                ) : (
                  <li onClick={() => onArchive(user.id)}>Архивировать</li> 
                )}
                <li onClick={() => onHide(user.id)}>Скрыть</li> 
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;