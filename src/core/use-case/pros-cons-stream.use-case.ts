
export const prosConsStreamUseCase=async(prompt:string)=>{
    try{
        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`,
            {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({prompt})
                // TODO:ABORT SIGNAL
            }
        );

        if (!resp.ok) throw new Error('Nop se pudo realizar la comparacion')
        const  reader =resp.body?.getReader()
        if(!reader){
            console.log('No se pudo realizar el reader')
            return null
        }
         
        // const decoder = new TextDecoder();
        // let text='';

        // while(true){
        //     const {value,done}=await reader.read();
        //     if (done){
        //         break
        //     }
        //     const decodedChunk=decoder.decode(value,{stream:true})
        //     text+=decodedChunk;
        //     console.log(text)
        // }

        return reader
    }catch(error){
        console.log(error)
        return null;
    }
}