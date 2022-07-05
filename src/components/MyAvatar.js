// hooks
import useAuth from '../hooks/useAuth';
//
import { MAvatar } from './@material-extend';
import createAvatar from '../utils/createAvatar';
// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }) {
  const { user } = useAuth();

  return (
    <MAvatar
      src="/static/mock-images/avatars/avatar_default.jpg"
      alt={user?.account ?? 'abc'}
      color={user.account ? 'default' : createAvatar(user.account).color}
      {...other}
    >
      {createAvatar(user.account).name}
    </MAvatar>
  );
}
