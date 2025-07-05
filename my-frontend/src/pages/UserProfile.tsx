import { useSelector } from 'react-redux';
import { RootState } from '../reducers';
const UserProfile = () => {
  const user = useSelector((state: RootState) => state.auth.userInfo);

  if (!user) return <p>Loading...</p>; // hoặc redirect, hoặc hiển thị thông báo

  return (
    <div>
      <h3>Profile Information</h3>
      <p>Username: {user?.username || "No username available"}</p>
      <p>Full Name: {user?.fullName || "No full name available"}</p>
      <p>Role: {user.role || "No role available"}</p>
      <img
        src={user.avatarUrl || "path/to/default-avatar.jpg"}
        alt="User Avatar"
        style={{ width: "100px", height: "100px" }}
      />
    </div>
  );
};


export default UserProfile;
