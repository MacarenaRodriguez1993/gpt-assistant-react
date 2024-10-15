import { useState } from "react"
import { GptMessage, GptOrthographyMessage, MyMessage, TextMessageBox,TypingLoader } from "../../components"
import { orthographyUseCase } from "../../../core/use-case";

export const OrthographyPage = () => {

  interface Message {
    text: string;
    isGtp: boolean;
    info?:{
      userScore:number;
      errors:string[];
      message:string;
    }
  }
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePost=async(text:string)=>{
    setIsLoading(true)
    setMessages((prev)=>[...prev,{text:text,isGtp:false}])
    
    const {ok,errors,message,userScore}=await orthographyUseCase(text)
    if (!ok){
      setMessages((prev)=>[...prev,{text:'no se pudo realizar la corrección del texto',isGtp:true,info:{errors,message,userScore}}])
      console.log('Aqui',message)
    }else{
      setMessages((prev)=>[...prev,{
        text:message,
        isGtp:true,
        info:{
          errors,
          message,
          userScore
        }
      }])
    }
    // TODO: Añador mensaje isGpt en true     
    setIsLoading(false)

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
                  <GptOrthographyMessage
                    key={index}
                    errors={message.info!.errors}
                    message={message.info!.message}
                    userScore={message.info!.userScore}
                  />
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
      {/* <TextMessageBoxFile
        onSendMessage={handlePost}
        placeholder="Escribe aqui lo que desees"
      /> */}
      {/* <TextMessageBoxSelect
      onSendMessage={console.log}
        options={[{id:'1',text:'hola'},{id:'2',text:'mujndo'}]}
      /> */}
    </div>
  )
}
