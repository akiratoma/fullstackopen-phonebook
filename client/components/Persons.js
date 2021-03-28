/* eslint-disable max-len */
import React from 'react'
import Person from './Person'

const Persons = ({ filter, persons, removeHandler }) => (
  <ul>
    {persons.filter((person) => person.name.toLowerCase().includes(filter)).map((person) => <Person key={person.id} name={person.name} number={person.number} id={person.id} removeHandler={removeHandler} />)}
  </ul>
)

export default Persons
