import * as React from 'react';
import { Navigate } from 'react-router-dom'
import RegisterForm from '../components/RegisterForm';
import { AuthContext } from '../contexts/AuthContext';
const RegisterPage: React.FC = () => {
    const [user] = React.useContext(AuthContext);
    if (user != null) {
        return <Navigate to='/' />
    }
    return (<div className='container page'>
        <RegisterForm />
    </div>);
}

export default RegisterPage;