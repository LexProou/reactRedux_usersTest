import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchUser, saveUser, setMessage, setOpen } from '../store/userSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import avatar from '../assets/img/avatar.png'
import arrow from '../assets/img/arrow.svg'
import { User } from '../types/User';

const EditPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, message, open } = useSelector((state: RootState) => state.users);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [activeSection, setActiveSection] = useState('profile');
  const [formData, setFormData] = useState<User | null>(user);

  const oneColor = '#161616'; 
  const threeColor = '#9C9C9C'; 

  useEffect(() => {
    if (userId) {
      dispatch(fetchUser(userId));
    }
  }, [userId, dispatch]);


  useEffect(() => {
    setFormData(user);
  }, [user]);

  // Изменение данных формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      if (!prevData) return null;
      if (name === 'city') {
        return {
          ...prevData,
          address: {
            ...prevData.address,
            city: value,
          },
        };
      } else if (name === 'companyName') {
        return {
          ...prevData,
          company: {
            ...prevData.company,
            name: value,
          },
        };
      } else {
        return {
          ...prevData,
          [name]: value,
        };
      }
    });
  };

  // Сохраняем данные пользователя
  const handleSave = () => {
    if (
      formData &&
      formData.name &&
      formData.username &&
      formData.email &&
      formData.address?.city &&
      formData.phone &&
      formData.company?.name
    ) {
      dispatch(saveUser(formData)); 
      dispatch(setOpen(true)); 
      setTimeout(() => {
        dispatch(setOpen(false)); 
      }, 4000);
    } else {
      dispatch(setMessage('Все поля обязательны для заполнения.')); 
      dispatch(setOpen(true)); 
    }
  };

  
  const handleClose = () => {
    dispatch(setOpen(false));
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'workspace':
        return (
          <form className='edit-form' ref={formRef}>
            <h1>Рабочее пространство</h1>
          </form>
        );
      case 'privacy':
        return (
          <form className='edit-form' ref={formRef}>
            <h1>Приватность</h1>
          </form>
        );
      case 'security':
        return (
          <form className='edit-form' ref={formRef}>
            <h1>Безопасность</h1>
          </form>
        );
      default:
        return (
          <form className='edit-form' ref={formRef}>
            <h1>Данные пользователя</h1>
            <TextField
              label="Имя"
              name="name"
              value={formData?.name || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Никнейм"
              name="username"
              value={formData?.username || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Почта"
              name="email"
              value={formData?.email || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Город"
              name="city"
              value={formData?.address?.city || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Телефон"
              name="phone"
              value={formData?.phone || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Компания"
              name="companyName"
              value={formData?.company?.name || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              className='button-save'
            >
              Сохранить
            </Button>
          </form>
        );
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  
  return (
    <div className='container-edit'>
      <Button onClick={() => navigate('/')} className='btn-back'>
        <img src={arrow} alt="Arrow" className="arrow" />Назад
      </Button>
      <div className='edit-page'>
        <div className='edit-info'>
          <img src={avatar} alt="Avatar" className="user-avatar" />
          <div className='edit-name'>
            <h1
              onClick={() => setActiveSection('profile')}
              style={{ color: activeSection === 'profile' ? oneColor : threeColor }}
            >
              Данные профиля
            </h1>
            <h1
              onClick={() => setActiveSection('workspace')}
              style={{ color: activeSection === 'workspace' ? oneColor : threeColor }}
            >
              Рабочее пространство
            </h1>
            <h1
              onClick={() => setActiveSection('privacy')}
              style={{ color: activeSection === 'privacy' ? oneColor : threeColor }}
            >
              Приватность
            </h1>
            <h1
              onClick={() => setActiveSection('security')}
              style={{ color: activeSection === 'security' ? oneColor : threeColor }}
            >
              Безопасность
            </h1>
          </div>
        </div>

        {renderSectionContent()}

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              style={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className='edit-dialog'>
            <CheckCircleIcon className='check-circle' />
            <DialogContentText>
              {message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default EditPage;