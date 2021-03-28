import React from 'react'

const Person = ({
  name, number, id, removeHandler,
}) => (
  <li>
    {name}
    {' '}
    {number}
    {' '}
    <button type="button" onClick={removeHandler} value={id}>delete</button>
  </li>
)

export default Person
