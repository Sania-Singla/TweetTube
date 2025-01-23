import { useSelector } from 'react-redux';

export default function Playlist() {
    const userData = useSelector((state) => state.user.userData);

    return userData ? <h2>Playlist found</h2> : <h2>login to see userdata</h2>;
}
//not in use right now
