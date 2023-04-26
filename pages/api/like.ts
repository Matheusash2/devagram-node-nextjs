import type { NextApiRequest, NextApiResponse } from "next";
import type { respostaPadraoMsg } from "@/types/respostaPadraoMsg";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { usuarioModel } from "@/models/usuarioModel";
import { publicacaoModel } from "@/models/publicacaoModel";
import { politicaCORS } from "@/middlewares/politicaCORS";

const likeEndpoint 
= async(req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) =>{
    try{
        if(req.method === 'PUT'){

            const {id} = req?.query;
            const publicacao = await publicacaoModel.findById(id);
                if(!publicacao){
                    return res.status(400).json({erro: 'Publicacao nao encontrada'});
                };

            const {userId} = req?.query;
            const usuario = await usuarioModel.findById(userId);
                if(!usuario){
                    return res.status(400).json({erro: 'Usuario nao encontrada'});
                };

            const indexDoUsuarioNoLike = publicacao.likes.findIndex((e: any) => e.toString() === usuario._id.toString());
                if(indexDoUsuarioNoLike != -1){
                    publicacao.likes.splice(indexDoUsuarioNoLike, 1);
                    await publicacaoModel.findByIdAndUpdate({_id: publicacao._id}, publicacao);
                    return res.status(200).json({msg:'Publicacao descurtida'});
                }else{
                    publicacao.likes.push(usuario._id);
                    await publicacaoModel.findByIdAndUpdate({_id: publicacao._id}, publicacao);
                    return res.status(200).json({msg: 'Publicacao curtida'})
                }
        };
        return res.status(405).json({erro: 'Matodo informado invalido'})
    }catch(e){
        console.log(e);
            return res.status(500).json({erro: 'Ocorreu erro ao curtir ou descurtir publicacao'});
    };
};

export default politicaCORS(validarTokenJWT(conectarMongoDB(likeEndpoint)));