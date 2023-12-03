import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import BookingWidget from '../BookingWidget';

function DetailPage() {
    const { id } = useParams();
    const [place, setPlace] = useState(null);
    const [showAllPhotos, setShowAllPhotos] = useState(false);

    useEffect(() => {
        if (!id)
            return;
        axios.get('/places/' + id).then(res => {
            setPlace(res.data);
        }).then(console.log(place))
    }, [id]);

    if (showAllPhotos) {
        return (
            <div className='absolute inset-0 bg-black min-h-screen '>
                <div className='bg-black grid gap-4'>
                    <div className=''>
                        <h2 className='text-3xl mr-48 text-white'>Photos of {place.title}</h2>
                        <button onClick={() => setShowAllPhotos(!showAllPhotos)}
                            className='fixed right-12 top-8 flex gap-1 text-black bg-white rounded-full p-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Back
                        </button>
                    </div>
                    {place?.photos.length > 0 && place.photos.map(photo => (
                        <div>
                            <img src={'http://localhost:4000/uploads/' + photo} />
                        </div>

                    ))}
                </div>

            </div>
        )
    }
    return (
        <div className='mt-4 bg-gray-100 pt-4 -mx-8 px-8 '>
            <h1>{place?.title}</h1>
            <a target='_blank' href={'http://maps.google.com/?q=' + place?.address}
                className='flex underline font-semibold gap-1 my-2'
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>

                {place?.address}
            </a>
            <div className='relative'>
                <div className='grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden'>
                    <div>
                        {place?.photos?.[0] && (
                            <div>
                                <img onClick={() => setShowAllPhotos(!showAllPhotos)} src={'http://localhost:4000/uploads/' + place.photos?.[0]} className='cursor-pointer w-full aspect-square object-cover' />
                            </div>

                        )}
                    </div>
                    <div className='grid  '>
                        {place?.photos?.[1] && (
                            <img onClick={() => setShowAllPhotos(!showAllPhotos)} src={'http://localhost:4000/uploads/' + place.photos?.[1]} className='cursor-pointer w-full aspect-square object-cover' />
                        )}
                        <div className='borde overflow-hidden'>
                            {place?.photos?.[2] && (
                                <img onClick={() => setShowAllPhotos(!showAllPhotos)} src={'http://localhost:4000/uploads/' + place.photos?.[2]}
                                    className='cursor-pointer w-full aspect-square object-cover relative top-1' />
                            )}
                        </div>
                    </div>
                </div>
                <button className='absolute flex gap-2 bottom-2 right-2 py-2  
                bg-white px-4 rounded-2xl shadow-md shadow-gray-500'
                    onClick={() => setShowAllPhotos(!showAllPhotos)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                    </svg>
                    Show more photos
                </button>
            </div>

            <div className='grid grid-cols-1 mt-8 gap-8 md:grid-cols-[2fr_1fr] mb-8'>
                <div>
                    <div className='my-4'>
                        <h2 className='text-2xl font-semibold'>Description</h2>
                        {place?.description}
                    </div>
                    Check in: {place?.checkIn}<br />
                    Check out: {place?.checkOut}<br />
                    Max number of guests: {place?.maxGuests}<br />
                </div>
                <div>
                    <BookingWidget place={place} />
                </div>
            </div>
            <div className='bg-white -mx-8 px-8 py-4 border-t'>
                <div>
                    <h2 className='text-2xl font-semibold'>Extra info</h2>
                </div>
                <div className='text-sm text-gray-800 leading-5 mt-2 mb-4 '>
                    {place?.extraInfo}
                </div>
            </div>

        </div>
    )
}

export default DetailPage