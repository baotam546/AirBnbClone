import React, { useContext, useState } from 'react'
import { differenceInCalendarDays } from 'date-fns';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { userContext } from './UserContext';
function BookingWidget({ place }) {
    const { user } = useContext(userContext);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState(user?.email);
    const [mobile, setMobile] = useState('');
    const [redirect, setRedirect] = useState(false);
    let numberOfDays = 0;
    if (checkIn && checkOut) {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        numberOfDays = differenceInCalendarDays(checkOutDate, checkInDate);
        console.log(numberOfDays);
    }
    async function bookThisPlace() {
        const  data  = {
            checkIn, checkOut, numberOfGuests, name, email, phone: mobile,
            placeId: place?._id,
            price: numberOfDays * place?.price
        };
        try {
            const res = await axios.post('/bookings', data);
            const bookingId = res.data._id;
            setRedirect(`/account/bookings/${bookingId}`);
        } catch (err) {
            console.log(err);
        }
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }

    return (
        <div className='bg-white shadow p-4 rounded-2xl'>
            <div className='text-2xl text-center'>
                Price: ${place?.price} / per night
            </div>
            <div className='border rounded-2xl mt-4'>
                <div className='flex'>
                    <div className=' py-3 px-4'>
                        <div>Check in: </div>
                        <input type="date" value={checkIn}
                            onChange={e => setCheckIn(e.target.value)}
                        />
                    </div>
                    <div className=' py-3 px-4 border-l'>
                        <div>Check in: </div>
                        <input type="date" value={checkOut}
                            onChange={e => setCheckOut(e.target.value)}
                        />
                    </div>
                </div>
                <div className=' py-3 px-4 border-t'>
                    <div>Number of guests: </div>
                    <input type="number" value={numberOfGuests}
                        onChange={e => setNumberOfGuests(e.target.value)}
                    />
                </div>
                {numberOfDays > 0 && (
                    <div className=' py-3 px-4 border-t'>
                        <div>Your full name:  </div>
                        <input type="text" value={name} placeholder='John Doe'
                            onChange={e => setName(e.target.value)}
                        />
                        <div>Phone number: </div>
                        <input type="tel" value={mobile}
                            onChange={e => setMobile(e.target.value)}
                        />
                    </div>

                )}
            </div>
            <button onClick={bookThisPlace} className='primary mt-2'>
                Book this place
                {numberOfDays > 0 && (
                    <span> {numberOfDays} days for ${numberOfDays * place?.price}</span>
                )}
            </button>
        </div>
    )
}

export default BookingWidget