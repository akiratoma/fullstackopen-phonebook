import React from 'react'

const Notification = ({ message, color }) => {
  const notificationStyle = {
    color,
    fontSize: '1.5em',
    backgroundColor: 'lightGray',
    padding: '0.5em',
    marginBottom: '0.5em',
    borderColor: color,
    borderStyle: 'solid',
    borderRadius: '0.25em',
  }

  if (message === '') {
    return null
  }
  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

export default Notification
