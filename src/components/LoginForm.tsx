import React from 'react';
import { Link } from 'react-router-dom';
import Server from '../core/CallServer';
import Toast from './Toast';
import { useNavigate } from 'react-router-dom';
import { IUser } from '../contexts/AuthContext';
interface LoginPayload {
    username: string;
    password: string;
}
interface LoginFormProps {
    setUser: React.Dispatch<React.SetStateAction<IUser | null>> | null;
    from: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ setUser, from }) => {
    const [loginData, setLoginData] = React.useState<LoginPayload>({ username: '', password: '' });
    const [loading, setLoading] = React.useState<boolean>(false);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setLoginData({ ...loginData, [name]: value });
    }
    const navigate = useNavigate();
    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setLoading(true);
        Server.login(loginData.username, loginData.password).then((res: any) => {
            setLoading(false);
            if (setUser) {
                setUser(res.data.user as IUser);
            }

            Toast.success("Login success. Have fun!");
            navigate(from);
        }).catch((err: any) => {
            setLoading(false);
            console.log(err);

            Toast.error(err.response.data.message);
        });
    }
    return (
        <div className="card" style={{ width: "19rem", margin: '3em auto ' }}>
            <div className="card-header" style={{ textAlign: 'center' }}>Login</div>
            <form className="card-body">
                <div className="form-group">
                    <label htmlFor="usernameInput">Username</label>
                    <input required style={{ width: '100%' }} name='username' type="text" placeholder="Username" id='usernameInput' value={loginData.username} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="passwordInput">Password</label>
                    <input required style={{ width: '100%' }} name='password' type="password" placeholder="Password" id='passwordInput' value={loginData.password} onChange={handleChange} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}><button disabled={loading} onClick={(e) => handleSubmit(e)} type='submit' style={{ paddingLeft: '1.5em', paddingRight: '1.5em' }} className="btn-secondary" >Login</button> <br /></div>
                <div style={{ textAlign: 'center', marginTop: '0.5em' }}>Forgot password?</div>
            </form>
            <div className="card-footer" >
                <div style={{ display: 'flex', justifyContent: 'center' }}><Link to="/register"> <button style={{ paddingLeft: '1.5em', paddingRight: '1.5em' }} className="btn-success" >Create new account</button></Link></div>
            </div>
        </div>
    )
}

export default LoginForm;