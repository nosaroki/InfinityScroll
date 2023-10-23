import React from 'react'
import { useState, useEffect, useRef } from 'react'
import spinner from "../assets/spinner.svg"
import usePhotos from '../hooks/usePhotos'

export default function List() {
    const [query, setQuery] = useState("random") // recherche
    const [pageNumber, setPageNumber] = useState(1) // plusieurs recherches possibles
    const lastPicRef = useRef()
    const searchRef = useRef()
    const photosApiData = usePhotos(query, pageNumber)

    useEffect(() => {
        if(lastPicRef.current) { // s'il y a une image
            const observer = new IntersectionObserver(([entry]) => {
                if(entry.isIntersecting && photosApiData.maxPages !== pageNumber) {
                    setPageNumber(pageNumber + 1)
                    lastPicRef.current = null
                    observer.disconnect
                }
            })
            observer.observe(lastPicRef.current)
        }
    }, [photosApiData])
    console.log(photosApiData)

    function handleSubmit(e) {
        e.preventDefault() // pour éviter le reload de la page
        if(searchRef.current.value !== query) { //si ce qui est dans l'input est différent du random on le remplace par le texte recherché
            setQuery(searchRef.current.value)
            setPageNumber(1)
        }
    }

  return (
    <>
    <h1 className='text-4xl text-orange-900'>Unsplash Clone</h1>
    <form onSubmit={handleSubmit}>
        <label htmlFor="search" className='block mb-4 text-orange-900'>Search for images...</label>
        <input ref={searchRef} 
        type="text"
        className='mb-14 w-full text-orange-700 py-3 px-2 text-md outline-orange-400 rounded border border-orange-400 placeholder-orange-600 placeholder-opacity-[0.40]'
        placeholder='What are you looking for?' />
    </form>

    {/* Affichage de l'erreur */}
    {photosApiData.error.state && <p>{photosApiData.error.msg}</p>} 

    {/* Pas d'erreur mais pas de résultats trouvés */}
    {(photosApiData.photos.length === 0 && !photosApiData.error.state && !photosApiData.loading) && <p className='text-orange-800'>Sorry, we couldn't find any images for your search.</p>}


    <ul className="grid grid-cols-[repeat(auto-fill,minmax(250px,_1fr))] auto-rows-[175px] gap-4 justify-center">
        {!photosApiData.loader && photosApiData.photos.length !== 0 && photosApiData.photos.map((photo, index) => {
            if(photosApiData.photos.length === index + 1)  { // si on arrive à la dernière photo
                return (
                    <li
                    ref={lastPicRef} 
                    key={photo.id}> 
                    <img className='w-full h-full object-cover' src={photo.urls.regular} alt={photo.alt_description} />
                    </li> 
                )
            }
            else {
                return(
            <li key={photo.id}> 
            <img className='w-full h-full object-cover' src={photo.urls.regular} alt={photo.alt_description} />
            </li>
           ) }
})}
    </ul>
    {/* {Loader} */}
    {(photosApiData.loading && !photosApiData.error.state) && <img className='block mx-auto' src={spinner}/>}
    
    {/* quand il n'y a plus de résultat à afficher */}
    {photosApiData.maxPages === pageNumber && <p className='mt-10 text-orange-800'>There is no more images to show for this research.</p>}
    
    </>
    
  )
}
