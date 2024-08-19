import { useAuthHook } from "../hooks";

export default function SubscribersPage() {
  const {userData,loginStatus} = useAuthHook();  

  if(loginStatus) {
    return (
      <div>Subscribers</div>
    )
  }
  else return <div>login to get userData</div>
}