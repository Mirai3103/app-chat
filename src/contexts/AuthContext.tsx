import React, { createContext, useEffect } from "react";
import Toast from "../components/Toast";
import Server from '../core/CallServer';
export interface IUser {
    id: string;
    username: string;
    fullName: string;
    gender: string;
    avatarURL: string;
}
interface AuthProviderProps {
    children: React.ReactNode
}
export const AuthContext = createContext<[IUser | null, React.Dispatch<React.SetStateAction<IUser | null>> | null]>([null, null]);
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = React.useState<IUser | null>(null);
    useEffect(() => {
        Server.getCurrentUser().then((res: any) => {
            console.log(res.data.user);

            setUser(res.data.user as IUser);
        }).catch(err => {
            if (err.message === 'Network Error') {
                Toast.error("Server is not available. Please try again later.");
            } else {
                console.log(err.response.data.message);
            }

        });
    }, [setUser]);

    return (
        <AuthContext.Provider value={[user, setUser]}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthProvider;