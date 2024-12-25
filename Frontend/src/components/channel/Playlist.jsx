import { useSelector } from 'react-redux';
import channelServices from '../../DBservices/channelServices';

function Playlist() {
    const userData = useSelector((state) => state.user.userData);

    return userData ? <h2>Playlist found</h2> : <h2>login to see userdata</h2>;
}

export default Playlist;

//not in use right now
