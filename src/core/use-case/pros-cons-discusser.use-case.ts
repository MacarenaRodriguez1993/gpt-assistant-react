import { ProsConsResponse } from "../../interfaces";

export const prosConsDiscusserUseCase=async(prompt:string)=>{
    try{
        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/pros-cons-discusser`,
            {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({prompt})
            }
        );

        if (!resp.ok) throw new Error('Nop se pudo realizar la comparacion')
        const data =await resp.json() as ProsConsResponse
        return{
            ok:true,
            ...data
        }
    }catch(error){
        console.log('AQUI')
        return{
            ok:false,
            content:'No se pudo realizar la comparacion'
        }
    }
}