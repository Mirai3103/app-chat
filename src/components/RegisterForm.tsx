import React from 'react';
import { Link } from 'react-router-dom';
import Toast from './Toast';
import { useNavigate } from 'react-router-dom';
import Server, { RegisterPayload } from '../core/CallServer';

const initData: RegisterPayload =
{
    username: '',
    password: '',
    fullName: '',
    gender: '',
}
const RegisterForm: React.FC = () => {
    const [loginData, setLoginData] = React.useState<RegisterPayload>(initData);
    const [loading, setLoading] = React.useState<boolean>(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        console.log(name, value);
        setLoginData({ ...loginData, [name]: value });
    }
    const handleRadioChange = (event: React.FormEvent<HTMLFieldSetElement>) => {
        const { name, value } = event.target as any;
        setLoginData({ ...loginData, [name]: value });
    }
    const navigate = useNavigate();
    const handleRegister = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setLoading(true);
        Server.register(loginData).then((data: any) => {
            setLoading(false);
            Toast.success("Register success. Login and have fun!");
            navigate('/login', { state: { from: '/' } });
        }).catch((err: any) => {
            setLoading(false);
            Toast.error(err.response.data.message);
        });
    }

    return (
        <div className="card" style={{ width: "23em", margin: '3em auto ' }}>

            <div className="card-header" style={{ textAlign: 'center' }}>Register</div>
            <form className="card-body">
                <div className="form-group">
                    <label htmlFor="fullnameInput">Full name</label>
                    <input required style={{ width: '100%' }} name='fullName' type="text" placeholder="Full name" id='fullnameInput' value={loginData.fullName} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="usernameInput">Username</label>
                    <input required style={{ width: '100%' }} name='username' type="text" placeholder="Username" id='usernameInput' value={loginData.username} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="passwordInput">Password</label>
                    <input required style={{ width: '100%' }} name='password' type="password" placeholder="Password" id='passwordInput' value={loginData.password} onChange={handleChange} />
                </div>
                {/* <div className="form-group">
                    <label htmlFor="dateOfBirth">Birthday</label>
                    <select id="dateOfBirth">
                        <option value="1">Option 1</option>
                        <option value="2">Option 2</option>
                        <option value="3">Option 3</option>
                    </select>
                </div> */}
                <fieldset className={`form-group`} onChange={handleRadioChange}>
                    <legend>Gender</legend>
                    <label htmlFor="maleRadio" className={`paper-radio`}>
                        <input type="radio" name="gender" id="maleRadio" value="MALE" /> <span>Male</span>
                    </label>
                    <label htmlFor="femaleRadio" className={`paper-radio`}>
                        <input type="radio" name="gender" id="femaleRadio" value="FEMALE" /> <span>Female</span>
                    </label>
                    <label htmlFor="ortherRadio" className={`paper-radio`}>
                        <input type="radio" name="gender" id="ortherRadio" value="ORTHER" /> <span>orther</span>
                    </label>
                </fieldset>
                <div style={{ display: 'flex', justifyContent: 'center' }}><button type='submit' disabled={loading} onClick={(e) => handleRegister(e)} style={{ paddingLeft: '1.5em', paddingRight: '1.5em' }} className="btn-secondary" >Register</button> <br /></div>
            </form>
            <div className="card-footer" >
                <div style={{ textAlign: 'center', marginTop: '0.5em' }}> <Link to={'/login'}> Already a account?</Link></div>
            </div>
        </div>
    )
}

export default RegisterForm;