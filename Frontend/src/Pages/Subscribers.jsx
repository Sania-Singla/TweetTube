import { useAuthHook } from "../hooks";

export default function SubscribersPage() {
    const { userData, loginStatus } = useAuthHook();

    if (loginStatus) {
        return <div>page under build yet :Subscribers</div>;
    } else return <div>login to get userData</div>;
}
