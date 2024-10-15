import { useState } from "react"
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components";
import { prosConsDiscusserUseCase } from "../../../core/use-case";

export const ProsConsPage = () => {

  interface Message {
    text: string;
    isGtp: boolean;
  }
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePost=async(text:string)=>{
    setIsLoading(true)
    setMessages((prev)=>[...prev,{text:text,isGtp:false}])
    
    const {ok,content}=await prosConsDiscusserUseCase(text)
    setIsLoading(false)
    
    if(!ok)return;
    
    setMessages((prev)=>[...prev,{text:content,isGtp:true}])
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <GptMessage text="¿Que deseas comparar?" />
          {
            messages.map((message, index) => (
              message.isGtp
                ? (
                  <GptMessage key={index} text={message.text}/>
                )
                : (
                  <MyMessage key={index} text={message.text} />
                )
            ))
          }
          {
          isLoading && (<div className="col-start-1 col-end-12 fade-in">
            <TypingLoader />
          </div>)
          }
        </div>
      </div>
      <TextMessageBox
        onSendMessage={handlePost}
        placeholder="Escribe aqui lo que desees"
        disableCorrectios
      />
    </div>
  )
}
