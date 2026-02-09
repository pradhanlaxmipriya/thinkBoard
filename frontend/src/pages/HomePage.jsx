import React from 'react'
import Navbar from '../components/Navbar'
import RateLimitesUI from '../components/RateLimitesUI.jsx'
import NoteCard from '../components/NoteCard.jsx'
import NotesNotFound from '../components/NotesNotFound.jsx'
import { useEffect } from 'react'
import api from '../../lib/axios.js'
import toast from 'react-hot-toast'

const HomePage = () => {
    const [israteLimited, setIsRateLimited]= React.useState(false)
    const [notes, setNotes]= React.useState([])
    const [loading, setLoading]= React.useState(true)

    useEffect(()=>{
        const fetchNotes= async()=>{
            try {
              const res= await api.get("/notes")
              console.log(res.data)  
              setNotes(res.data)
              setIsRateLimited(false)
            } catch (error) {
                console.log("Error fetching notes:")
                if(error.response?.status == 429){
                    setIsRateLimited(true)

                }
                else{
                    toast.error("Failed to load notes")
                }
                
            }finally{
                    setLoading(false)
                }
        }
        fetchNotes();
    },[])
  return (
    <div className='min-h-screen'>
       <Navbar/>
       {israteLimited && <RateLimitesUI/>}

       <div className='max-w-7xl mx-auto p-4 mt-6'>
           {loading && <div className='text-center text-primary py-10'>
            Loading notes...</div>}

            {notes.length === 0 && !israteLimited && <NotesNotFound/>}

            {notes.length> 0 && !israteLimited && (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {notes.map(note => (
                       <NoteCard key={note.id} note={note} setNotes={setNotes}/>
                    ))}
                </div>
            )}
       </div>
    </div>
  )
}

export default HomePage
