import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    personService.getAll().then((res) => { setPersons(res) })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.map((person) => person.name).includes(newName)) {
      const { id } = persons.filter((person) => person.name === newName)[0]
      // eslint-disable-next-line no-alert
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService.update(id, { name: newName, number: newNumber }).then((res) => {
          setPersons(persons.reduce((acc, cur) => acc.concat(cur.name === newName ? res : cur), []))
          setSuccessMessage(`Updated ${newName}`)
          setTimeout(() => {
            setSuccessMessage('')
          }, 5000)
          setNewName('')
          setNewNumber('')
        }).catch((err) => {
          if (err.response.status === 400) {
            setErrorMessage(err.response.data.error)
            setTimeout(() => {
              setErrorMessage('')
            }, 5000)
          }
        })
      }
    } else {
      personService.create({ name: newName, number: newNumber }).then((res) => {
        setPersons(persons.concat(res))
        setSuccessMessage(`Added ${newName}`)
        setTimeout(() => {
          setSuccessMessage('')
        }, 5000)
        setNewName('')
        setNewName('')
        setNewNumber('')
      }).catch((err) => {
        if (err.response.status === 400) {
          setErrorMessage(err.response.data.error)
          setTimeout(() => {
            setErrorMessage('')
          }, 5000)
        }
      })
    }
  }

  const handleNameChange = (event) => { setNewName(event.target.value) }
  const handleNumberChange = (event) => { setNewNumber(event.target.value) }
  const handleFilterNameChange = (event) => { setFilterName(event.target.value) }
  const handleRemove = (event) => {
    const id = event.target.value
    const { name } = persons.filter((person) => person.id === id)[0]
    // eslint-disable-next-line no-alert
    if (window.confirm(`Delete ${name} ?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id))
      }).catch(() => {
        setErrorMessage(`Information of ${name} has already been removed from server`)
        setTimeout(() => {
          setErrorMessage('')
        }, 5000)
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} color="green" />
      <Notification message={errorMessage} color="red" />
      <Filter value={filterName} handleChange={handleFilterNameChange} />
      <h3>add a new</h3>
      <PersonForm onSubmit={addPerson} nameValue={newName} nameHandler={handleNameChange} numberValue={newNumber} numberHandler={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons filter={filterName} persons={persons} removeHandler={handleRemove} />
    </div>
  )
}

export default App
