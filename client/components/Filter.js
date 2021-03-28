import React from 'react'

const Filter = ({ value, handleChange }) => (
  <div>
    filter shown with:
    {' '}
    <input value={value} onChange={handleChange} />
  </div>
)

export default Filter
