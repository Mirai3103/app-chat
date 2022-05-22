import axios from "axios";

export interface RegisterPayload {
    fullName: string;
    username: string;
    password: string;
    gender: string;
}

const instance = axios.create({
    baseURL: "https://realtimechatlaffy.herokuapp.com/api",
    withCredentials: true
});



const login = (username: string, password: string) => {
    return instance.post("/auth/login", { username, password });
}
const register = (data: RegisterPayload) => {
    return instance.post("/auth/register", { user: data });
}
const logout = () => {
    return instance.get("/auth/logout");
}
const getCurrentUser = () => {
    return instance.get("/auth");
}
const getListRoom = () => {
    return instance.get("/user/rooms");
}
const getChatToken = (roomId: number) => {
    return instance.get(`/chat/tickets/${roomId}`);
}
const getAllMessage = (roomId: number) => {
    return instance.get(`/chat/messages/${roomId}`);
}
const joinARoom = (roomId: number) => {
    return instance.post(`/user/joinRoom`, { roomId });
}
export default {
    login,
    register,
    logout,
    getCurrentUser,
    getListRoom,
    getChatToken,
    getAllMessage,
    joinARoom
} as const;