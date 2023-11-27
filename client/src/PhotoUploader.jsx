import axios from 'axios';
import React, { useState } from 'react'

function PhotoUploader({ addedPhotos, setAddedPhotos }) {
    const [photoLink, setPhotoLink] = useState('');
    async function addPhotoByLink(e) {
        e.preventDefault();
        const { data: filename } = await axios.post('/upload-by-link', { link: photoLink })
        setAddedPhotos(prev => [...prev, filename]);
        setPhotoLink('');
    }
    function uploadPhotos(e) {
        const files = e.target.files;
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append('photos', files[i]);
        }
        axios.post('upload', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            const { data: filenames } = response;
            setAddedPhotos(prev => [...prev, ...filenames]);
        })
    }
    return (
        <>
            <div className='flex gap-2'>
                <input type="text" value={photoLink} onChange={e => setPhotoLink(e.target.value)} placeholder={'Add using image address...'} />
                <button onClick={addPhotoByLink} className=' bg-gray-200 grow px-4 rounded-2xl'>Add photo</button>
            </div>
            <div className='mt-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10'>
                {addedPhotos.length > 0 && addedPhotos.map(link => (
                    <div className='h-32 flex relative' key={link}>
                        <img className='rounded-2xl w-full object-cover'
                            src={'http://localhost:4000/uploads/' + link} />
                        <button className='absolute bottom-1 right-1 text-white cursor-pointer bg-black bg-opacity-50 p-1 rounded-full'
                            onClick={() => setAddedPhotos(prev => prev.filter(p => p !== link))}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </button>
                    </div>
                ))}
                <label className='flex justify-center items-center cursor-pointer gap-2 bg-transparent border rounded-2xl p-8 text-2xl text-gray-600'>
                    <input type='file' multiple className='hidden'
                        onChange={uploadPhotos}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <p className='text-base'>Upload</p>
                </label>
            </div>
        </>
    )
}

export default PhotoUploader