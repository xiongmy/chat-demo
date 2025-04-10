import React, { useState } from "react"


const testComponent:React.FC= ()=>{
    const [content, setContent] = useState('旧内容')
    function handleClick (){
        setContent('新内容')
    }
    return (
        <div>
            <p>{content}</p>
            <button onClick={handleClick}>设置</button>
        </div>
    )
}

export default testComponent