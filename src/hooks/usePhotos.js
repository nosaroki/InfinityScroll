// hook = ensemble de fonctionnalités REACT réutilisées à plusieurs endroits
// hook ne retourne pas de jsx (fonctionnalités REACT qui retournent du jsx = composant)

// Ici, appeler l'API

import React from 'react'
import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid' // pour donner des id unique aux photos

export default function usePhotos(querySearch, pageIndex) {
    const [error, setError] = useState({
        msg: "",
        state: false
    })
    const [photos, setPhotos] = useState([]) // prendre les photos et les retourner
    const [maxPages, setMaxPages] = useState(0)
    const [loading, setLoading] = useState(true)
    photos.id = nanoid()


    useEffect(() => { // va changer que lors des query search
        if(photos.length !== 0 && maxPages !== 0) { // si y a déjà eu des recherches je remets à 0
            setPhotos([])
            setMaxPages(0)
        }
    }, [querySearch])

    useEffect(() => {
        setLoading(true) // effet secondaire qui permet d'appeler l'API
        fetch(`https://api.unsplash.com/search/photos?page=${pageIndex}&per_page=30&query=${querySearch}&client_id=${import.meta.env.VITE_UNSPLASH_KEY}`)
        .then(response => {
            if(!response.ok) throw new Error(`${response.status} Error, something went wrong`)
            return response.json()
        })
        .then(data => {
            setPhotos(state => [...state, ...data.results])
            setMaxPages(data.total_pages)
            setLoading(false) // le loader ne s'affiche plus si les photos sont affichées
        })
        .catch(err => {
            setError({ // gère les erreurs de fetch (erreurs réseau)
                msg: err.message,
                state: true
            })
            setLoading(false)
        })

    }, [querySearch, pageIndex])

    return {error, photos, maxPages, loading}
}
