import { useState } from "react"
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from "../components";

export const ChatTemplate = () => {

  interface Message {
    text: string;
    isGtp: boolean;
  }
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePost=async(text:string)=>{
    setIsLoading(true)
    setMessages((prev)=>[...prev,{text:text,isGtp:false}])
    //TODO:USE_CASE
    setIsLoading(false)
    // TODO: Añador mensaje isGpt en true     

  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <GptMessage text="Hola, escribe tu texto y te ayudo con la ortografia del mismo" />
          {
            messages.map((message, index) => (
              message.isGtp
                ? (
                  <GptMessage key={index} text="Esto es de OpenAi" />
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
