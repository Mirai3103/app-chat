import * as React from 'react';
import LoginForm from '../components/LoginForm';
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext';
const LoginPage: React.FC = () => {
    const location = useLocation();
    console.log(location);

    let from: string;
    if (location.state === null) {
        from = '/'
    } else {
        from = (location.state as any).from.pathname || '/';
    }

    const [user, setUser] = React.useContext(AuthContext);
    if (user != null) {
        return <Navigate to={from} />
    }
    return (
        <div className='container page'>
            <LoginForm setUser={setUser} from={from} />
        </div>
    )
}

export default LoginPage;