import type { NextApiRequest, NextApiResponse } from "next";
import type { respostaPadraoMsg } from "@/types/respostaPadraoMsg";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { error } from "console";
import { usuarioModel } from "@/models/usuarioModel";

const usuarioEndpoint = async(req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg | any>) =>{
     try{
        const {userId} = req?.query;
        const usuario = await usuarioModel.findById(userId);
        usuario.senha = null;
        return res.status(200).json(usuario);
        
     }catch(e){
        console.log(e);
    };
    return res.status(400).json({erro: 'Nao foi possivel obter dados do usuario'});
    
};

export default validarTokenJWT(conectarMongoDB(usuarioEndpoint));