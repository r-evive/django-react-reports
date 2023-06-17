import React, { useContext, useEffect, useState } from 'react'
import { Header } from './Reports.styled'
import List from './List/List'
import { User } from '../../context/userContext'

const Reports = () => {
  let [user] = useContext(User);
  let [lectures, setLectures] = useState([]);

  const fetchLectures = async () => {
    await fetch('http://localhost:8000/lectures/get_summary', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user.data.user_id
      })})
    .then(res => res.json())
    .then(data => {
        setLectures(data);
    })
    .catch(err => {
        console.log(err);
    })
}

useEffect(() => {
  if(user.logged) {
    fetchLectures();
  }

}, [user.logged]);
return (
  <>
    <Header>Sprawozdania:</Header>
    {lectures.length > 0 && lectures?.map((lecture, index) => <List key={index} lecture={lecture} />)}
  </>
)
}

export default Reports