import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller, FieldValues, FieldError } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Button, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  IconButton 
} from '@mui/material';
import { X as CloseIcon, CheckCircle } from 'lucide-react';
import { RootState, AppDispatch } from '../store/store';
import { fetchUser, saveUser, setMessage, setOpen } from '../store/userSlice';
import { clearErrors } from '../store/validationSlice';
import { User } from '../types/User';

import avatar from '../assets/img/avatar.png';
import arrow from '../assets/img/arrow.svg';

type Section = 'profile' | 'workspace' | 'privacy' | 'security';

interface FormField {
  name: keyof User | 'address.city' | 'company.name'; 
  label: string;
}

const EditPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { user, loading, message, open } = useSelector((state: RootState) => state.users);
  const { errors, isValid } = useSelector((state: RootState) => state.validation);
  
  const [activeSection, setActiveSection] = useState<Section>('profile');

  const { control, handleSubmit, setValue, formState: { isSubmitting } } = useForm<User>({
    defaultValues: {
      name: '',
      username: '',
      email: '',
      address: { city: '' },
      phone: '',
      company: { name: '' },
    },
    mode: 'onBlur', 
  });

  const oneColor = '#161616';
  const threeColor = '#9C9C9C';

  // Загружаем данные пользователя 
  useEffect(() => {
    if (userId) {
      dispatch(fetchUser(userId)); 
    } else {
      console.error('User ID is undefined');
    }
    return () => {
      dispatch(clearErrors());
    };
  }, [userId, dispatch]);

  useEffect(() => {
    if (user) {
      const fields = ['name', 'username', 'email', 'phone'] as const;
      fields.forEach(field => setValue(field, user[field]));
      setValue('address.city', user.address.city);
      setValue('company.name', user.company.name);
    }
  }, [user, setValue]);

  // Отправка формы
  const onSubmit = async (data: User) => {
    try {
      if (!userId) {
        console.error('User ID is undefined');
        return;
      }
      const numericUserId = parseInt(userId, 10);
      if (isNaN(numericUserId)) {
        console.error('User ID is not a valid number');
        return;
      }
      const resultAction = await dispatch(saveUser({ ...data, id: numericUserId }));
      if (saveUser.fulfilled.match(resultAction)) {
        dispatch(setMessage('Данные пользователя успешно обновлены'));
        dispatch(setOpen(true));
        setTimeout(() => dispatch(setOpen(false)), 4000);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      dispatch(setMessage('Произошла ошибка при сохранении'));
      dispatch(setOpen(true));
    }
  };

  // Поля формы
  const fields = useMemo(() => [
    { name: 'name', label: 'Имя' },
    { name: 'username', label: 'Никнейм' },
    { name: 'email', label: 'Почта' },
    { name: 'address.city', label: 'Город' },
    { name: 'phone', label: 'Телефон' },
    { name: 'company.name', label: 'Компания' }
  ], []);

  // Рендерим форму
  const renderForm = () => (
    <form className='edit-form' onSubmit={handleSubmit(onSubmit)}>
      <h1>{sectionTitles[activeSection]}</h1>

      {activeSection === 'profile' && fields.map((field: FormField) => (
        <Controller
          key={field.name}
          name={field.name as string}
          control={control}
          rules={{
            required: 'Это поле обязательно',
            pattern: field.name === 'email' ? {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: 'Введите корректный адрес электронной почты'
            } : undefined
          }}
          render={({ field: { onChange, value, ...fieldProps }, fieldState }) => {
            const errorMessage = errors[field.name as keyof FieldValues] as unknown;
            const typedErrorMessage = errorMessage as FieldError | undefined;
            return (
              <TextField
                {...fieldProps}
                label={field.label}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                error={!!typedErrorMessage || !!fieldState.error}
                helperText={typedErrorMessage ? typedErrorMessage.message : fieldState.error?.message || ' '}
                fullWidth
                margin="normal"
              />
            );
          }}
        />
      ))}

      {activeSection === 'profile' && (
        <Button
          variant="contained"
          color="primary"
          type="submit"
          className='button-save'
          disabled={!isValid || isSubmitting}
        >
          Сохранить
        </Button>
      )}
    </form>
  );

  // заголовки профиля
  const sectionTitles: { [key in Section]: string } = {
    profile: 'Данные пользователя',
    workspace: 'Рабочее пространство',
    privacy: 'Приватность',
    security: 'Безопасность',
  };

  // Рендерим секции
  const renderSections = () => (
    <div className='edit-name'>
      {(['profile', 'workspace', 'privacy', 'security'] as Section[]).map(section => (
        <h1
          key={section}
          onClick={() => setActiveSection(section)}
          style={{ color: activeSection === section ? oneColor : threeColor }}
        >
          {sectionTitles[section]}
        </h1>
      ))}
    </div>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container-edit'>
      <Button onClick={() => navigate('/')} className='btn-back'>
        <img src={arrow} alt="Arrow" className="arrow" />
        Назад
      </Button>

      <div className='edit-page'>
        <div className='edit-info'>
          <img src={avatar} alt="Avatar" className="user-avatar" />
          {renderSections()}
        </div>

        {renderForm()}

        <Dialog open={open} onClose={() => dispatch(setOpen(false))}>
          <DialogTitle>
            <IconButton
              aria-label="close"
              onClick={() => dispatch(setOpen(false))}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className='edit-dialog'>
            <CheckCircle className='check-circle' />
            <DialogContentText>{message}</DialogContentText>
          </DialogContent>
          <DialogActions />
        </Dialog>
      </div>
    </div>
  );
};

export default EditPage;