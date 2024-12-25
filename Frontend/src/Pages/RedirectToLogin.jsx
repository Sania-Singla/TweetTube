import { useNavigate, Navigate } from 'react-router-dom';
import { useAuthHook } from '../hooks';

export default function RedirectToLogin({ children }) {
    const { loginStatus } = useAuthHook();
    // const navigate = useNavigate();

    // return  loginStatus ? children : navigate("/login");    //hooks cant be used in JSX so will have to use Navigate component which is speacially made for redirects
    return loginStatus ? children : <Navigate to="/login" />;
}

/*⭐ navigate is used for redirection on some user interaction 
 for ex: in login/register(btn click) or options click some method executes to fetch data then it redirects 
 but if we have predefined everything means we are not performing any calculations or fetching just checking something like here if loginstatus is true or not 
 and then redirecting so without any user interaction we are redirecting then we have to use <Navigate to=""/> which is since a jsx component so can be used in conditional rendering and all  
*/
