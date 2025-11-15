import React, { useState, useRef } from 'react'
import { useChatStore } from '../store/useChatStore';
import { X,Image , Send} from 'lucide-react';
import {toast} from 'react-hot-toast'
const MessageInput = () => {
    const [text, setText] = useState("");

    // state for image preview
    const [imagePreview, setImagePreview] = useState(null);

    //state for file
    const [imageFile, setImageFile] = useState(null);

    const fileInputRef = useRef(null);
    const { sendMessage } = useChatStore();


    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error(`Please select an image file. `);
            return;
        }

        setImageFile(file) //store the raw file
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)
    }

    const removeImage = async () => {
        setImagePreview(null);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";

    }

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!text.trim() && !imageFile) return;

        const formData = new FormData();
        formData.append('text', text.trim());
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            await sendMessage(formData);

            // clear form
            setText("");
            setImagePreview(null);
            setImageFile(null)
            if (fileInputRef.current) fileInputRef.current.value = "";
        }

        catch (error) {
            console.error(`Failed to send message `, error)
        }
    }
  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />

            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button">
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }                    
                        `}
            onClick={() => fileInputRef.current?.click()}>
            <Image size={20} />
          </button>
        </div>

              <button type='submit' className='btn btn-sm btn-circle btn-primary'
              disabled={!text.trim() && !imageFile}>
                  <Send className='size-4'/>
        </button>
      </form>
    </div>
  );
}

export default MessageInput