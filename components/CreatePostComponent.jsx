"use client"
import React, { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import {v4 as uuidv4} from 'uuid';

 export default function CreatePost({user}){
    const supabase = createClientComponentClient();
    const [uplodedFile, setUploadedFile] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [textInput, setTextInput] = useState("");
    const [uploading, setUploading] = useState(false);

  

    const uploadFile = async (event) => {
      try {
        setUploading(true)
  
        if (!event.target.files || event.target.files.length === 0) {
          throw new Error('You must select an image to upload.')
        }
  
        const file = event.target.files[0];
        setUploadedFile(file);
        const fileExt = file.name.split('.').pop();
        const filePath = user?.id + "/" + Math.random()+"."+fileExt;
        setFileUrl(filePath);
  
       
        let { error: uploadError } = await supabase.storage.from('postfiles').upload(filePath, file)
        
      } catch (error) {
        alert('Error uploading image')
      } finally {
        setUploading(false)
      }
    }

    async function submitPost(){
        let postId = uuidv4();

        try {
            setLoading(true)
             
            const { error } = await supabase.from('posts').insert({ user_id:user?.id,post_id:postId, post_text:textInput, post_file:fileUrl})
        
      
      
      
            if (error) throw error
            alert('Profile updated!')
          } catch (error) {
            alert('Error updating the data!')
          } finally {
            setLoading(false)
          }
       



    }


    return (
        <div>
            
            
            
            <label className="button primary block blue-btn" htmlFor="post-message">
                Write anything..
            </label>
            <input id="post-message" value={textInput} onChange={(event)=> setTextInput(event.target.value) } ></input>
       
       
        <label className="button primary block blue-btn" htmlFor="single">
          {uploading ? 'Uploading ...' : 'Upload Picture'}
        </label>
    
       <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadFile}
          disabled={uploading}
          
        />
        <button disabled={loading} onClick={submitPost}>Post</button>
      
        </div>
    )


 }