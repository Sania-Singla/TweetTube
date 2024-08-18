import { useSelector } from "react-redux";

export default function useAuthHook() {
    const loginStatus = useSelector(state=>state.user.loginStatus)
    const userData = useSelector(state=>state.user.userData)
    
    return {loginStatus,userData};
}