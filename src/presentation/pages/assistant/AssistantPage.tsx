
import { useEffect, useState } from "react"
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from "../../components";
import { createThreadUseCase } from "../../../core/use-case";
import { postQuestionUseCase } from "../../../core/use-case/assistant/post-question.use-case";

interface Message {
  text: string;
  isGtp: boolean;
}

export const AssistantPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const [threadId,setThreadId]=useState<string>();

  useEffect(() => {
    const threadId=localStorage.getItem('threadId')
    if(threadId) setThreadId(threadId)
    else{
      createThreadUseCase()
        .then(id=>{
          setThreadId(id);
          localStorage.setItem('threadId',id)
        })
    }
  }, [])

  useEffect(() => {
    if ( threadId ) {
      setMessages((prev)=>[ ...prev, {text:`Número de thread ${ threadId }`,isGpt: true }])
    }
  }, [threadId])

  const handlePost=async(text:string)=>{
    if (!threadId) return
    setIsLoading(true)
    setMessages((prev)=>[...prev,{text:text,isGtp:false}])
    
    const responses= await postQuestionUseCase(threadId,text)
    setIsLoading(false)

    for (const response of responses) {
      for (const message of response.content) {
        setMessages((prev)=>[
          ...prev,
          {text:message,isGtp:(response.role==='assistant'),info:response}
        ])
      }
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <GptMessage text="Hola,soy tu asistente Apprende, en que puedo ayudarte]?" />
          {
            messages.map((message, index) => (
              message.isGtp
                ? (
                  <GptMessage key={index} text={message.text} />
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
