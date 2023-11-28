import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

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
                        <h2 className='text-2xl text-white'>Photos of {place.title}</h2>
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
        <div className='mt-4 bg-gray-100 pt-4 -mx-8 px-8 py-8'>
            <h1>{place?.title}</h1>
            <a target='_blank' href={'http://maps.google.com/?q=' + place?.address}
                className='underline font-semibold block my-2'
            >
                {place?.address}
            </a>
            <div className='relative'>
                <div className='grid gap-2 grid-cols-[2fr_1fr]'>
                    <div>
                        {place?.photos?.[0] && (
                            <div>
                                <img src={'http://localhost:4000/uploads/' + place.photos?.[0]} className='w-full aspect-square object-cover' />
                            </div>

                        )}
                    </div>
                    <div className='grid  '>
                        {place?.photos?.[1] && (
                            <img src={'http://localhost:4000/uploads/' + place.photos?.[1]} className='w-full aspect-square object-cover' />
                        )}
                        <div className='borde overflow-hidden'>
                            {place?.photos?.[2] && (
                                <img src={'http://localhost:4000/uploads/' + place.photos?.[2]}
                                    className='w-full aspect-square object-cover relative top-1' />
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
        </div>
    )
}

export default DetailPage