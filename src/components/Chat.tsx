"use client";
import React, { useEffect, useState} from 'react';
import axios from 'axios';

interface ChatElement {
    type:string,
    message:string
}

export default function Chat() {
    const [inputValue, setInputValue] = useState('');
    const [chatLog, setChatLog] = useState<ChatElement[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        setChatLog((prevChatLog) => [...prevChatLog, {type: 'user', message: inputValue}]);

        sendMessage(inputValue);

        setInputValue('');
    }

    const sendMessage = (message : string) => {
        const url = 'https://api.openai.com/v1/chat/completions';
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}` 
        };
        const data = {
            model : 'gpt-4',
            messages: [{"role":"user", "content":message}]
        };

        setLoading(true);

        axios.post(url, data, { headers:headers }).then((response : any) => {
            console.log(response)
            setChatLog((prevChatLog) => [...prevChatLog, {type:'bot', message:response.data.choices[0].message.content}]);
            setLoading(false);
        }).catch((error) => {
            console.error(error);
        })

        
    }

    return (
        <div className="container mx-auto max-w-[700px]">
            <div className='flex flex-col h-screen bg-gray-900 overflow-auto pb-20'>
                <h1 className='bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-center py-3 font-bold text-4xl'>Chat Box - (Give Good Name Later)</h1>
                <div className='flex-grow p-6'>
                    <div className='flex flex-col space-y-4'>
                        {chatLog.map((messageElement, index) => (
                            <div key={index} className={`flex ${
                                messageElement.type === 'user' ? 'justify-end' : 'justify-start'
                            }`}>
                                <div className={`${
                                    messageElement.type === 'user' ? 'bg-purple-500' : 'bg-gray-800'
                                } rounded-lg p-4 text-white max-w-sm`}>
                                {messageElement.message}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="flex-none p-6 fixed bottom-0 w-full max-w-[700px] mx-auto">
                    <div className='flex rounded-lg border border-gray-700 bg-gray-800 gap-4'>
                        <input type="text" className='flex-grow px-4 py-2 bg-transparent text-white focus:outline-none' placeholder="Ask AI about your data" value={inputValue} onChange={(e)=>setInputValue(e.target.value)}/>
                        <button type="submit" className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300">Send</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
