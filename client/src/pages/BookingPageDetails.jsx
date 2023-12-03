import React from 'react'
import { useParams } from 'react-router-dom'

function BookingPageDetails() {
    const {id} = useParams();
    
  return (
    <div>BookingPageDetails</div>
  )
}

export default BookingPageDetails