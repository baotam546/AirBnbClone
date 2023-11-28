import axios from 'axios';
import React, { useEffect, useState } from 'react'
import PhotoUploader from '../PhotoUploader';
import Perks from '../Perks';
import AccountNav from '../AccountNav';
import { Navigate, useParams } from 'react-router-dom';

function PlacesFormPage() {
    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [photoLink, setPhotoLink] = useState('');
    const [description, setDescription] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [price, setPrice] = useState(100);
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(() =>{
        if(!id)
        return;
        axios.get('/places/'+id).then(res =>{
            const {data} = res;
            setTitle(data.title);
            setAddress(data.address);
            setAddedPhotos(data.photos);
            setDescription(data.description);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
            setPrice(data.price);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo);
            setPrice(data.price);
        })
    },[id])
    function inputHeader(text) {
        return <h2 className='text-2xl mt-4 '>{text}</h2>
    }
    function inputDescription(text) {
        return <p className='text-gray-500 my-2 text-sm'>{text}</p>
    }
    function preInput(header, description) {
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        )
    }
    async function savePlace(e) {
        e.preventDefault();
        const place = {     
                title,
                address,
                addedPhotos,
                description,
                checkIn,
                checkOut,
                maxGuests,
                price,
                perks,
                extraInfo
            };
        if(id){
            const response = await axios.put('/places',{
                id,
                ...place
            });
            if(response.status === 200) {
                setRedirect(true);
            }
        }else{
            const response = await axios.post('/places', place);
            if(response.status === 200) {
                setRedirect(true);
            }
        }
    }

    if(redirect) {
        return <Navigate to={'/account/places'} />
    }
    return (
        <div>
            <AccountNav/>
            <form onSubmit={savePlace}>
                <div>
                    {preInput('Title', 'Title for your place. should be short and catchy as possible')}
                    <input type='text' value={title} onChange={e => setTitle(e.target.value)} placeholder='title, for example: My apartment' />
                    {preInput('Address', 'Address of your place')}
                    <input type='text' value={address} onChange={e => setAddress(e.target.value)} placeholder='address' />
                    {preInput('Photos', 'Recommend more than 2 photos')}
                    <PhotoUploader addedPhotos={addedPhotos} setAddedPhotos={setAddedPhotos} />
                    {preInput('Description', 'Description of the place')}
                    <textarea value={description} onChange={e => setDescription(e.target.value)} />
                    {preInput('Perks', 'Select all the perks of your place')}
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2'>
                        <Perks selected={perks} onChange={setPerks} />
                    </div>
                </div>
                {preInput('Extra info', 'House rules, etc')}
                <textarea value={extraInfo} onChange={e => setExtraInfo(e.target.value)} />
                {preInput('Check in & out times', 'Add check in & out time, remember to have some time window for cleaning room between guests')}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                    <div>
                        <div className='mt-2 -mb-1'>Check in time</div>
                        <input type="number" value={checkIn} onChange={e => setCheckIn(e.target.value)} placeholder='14:00' />
                    </div>
                    <div>
                        <div className='mt-2 -mb-1'>Check out time</div>
                        <input type="number" value={checkOut} onChange={e => setCheckOut(e.target.value)} placeholder='11:00' />
                    </div>
                    <div>
                        <div className='mt-2 -mb-1'>Max number guests</div>
                        <input type="number" value={maxGuests} onChange={e => setMaxGuests(e.target.value)} />
                    </div>
                    <div>
                        <div className='mt-2 -mb-1'>Price per night ($)</div>
                        <input type="number" value={price} onChange={e => setPrice(e.target.value)} />
                    </div>
                </div>
                <div>
                    <button className='primary my-4'>Save</button>
                </div>
            </form>
        </div>

    )
}

export default PlacesFormPage