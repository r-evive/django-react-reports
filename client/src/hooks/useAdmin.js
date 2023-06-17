import React from 'react'
import { useContext } from 'react'
import { User } from '../context/userContext';

const useAdmin = () => {
  const [user] = useContext(User);
  return user?.data?.groups?.includes('admin')
}

export default useAdmin