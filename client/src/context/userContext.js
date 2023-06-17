import { createContext, useState } from 'react';
import UserConfig from './default/user';

export const User = createContext(UserConfig);

const UserContextProvider = (props) => {
    const [user, setUser] = useState(UserConfig);

    return (
        <User.Provider value={[user, setUser]}>
            {props.children}
        </User.Provider>
    );
};

export default UserContextProvider;