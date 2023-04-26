import type { NextApiRequest, NextApiResponse } from "next";
import type { respostaPadraoMsg } from "@/types/respostaPadraoMsg";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { usuarioModel } from "@/models/usuarioModel";
import { seguidorModel } from "@/models/seguidorModel";
import { politicaCORS } from "@/middlewares/politicaCORS";

const seguirEndpoint 
= async(req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) =>{
    try{
        if(req.method === 'PUT'){
            const {userId, id} = req?.query;

            const usuarioLogado = await usuarioModel.findById(userId);
            if(!usuarioLogado){
                return res.status(400).json({erro: 'Usuario logado nao encontrado'});                
            }
            const usuarioASerSeguido = await usuarioModel.findById(id);
            if(!usuarioASerSeguido){
                return res.status(400).json({erro: 'Usuario a ser seguido nao encontrado'});
            }
            const euJaSigoEsseUsuario = await seguidorModel
                .find({usuarioId: usuarioLogado._id, usuarioSeguidoId: usuarioASerSeguido._id});
            if(euJaSigoEsseUsuario && euJaSigoEsseUsuario.length > 0){
                euJaSigoEsseUsuario.forEach(async(e : any) => await seguidorModel.findByIdAndDelete({_id: e._id}));
                
                usuarioLogado.seguindo--;
                await usuarioModel.findByIdAndUpdate({_id: usuarioLogado._id}, usuarioLogado);
                
                usuarioASerSeguido.seguidores--;
                await usuarioModel.findByIdAndUpdate({_id: usuarioASerSeguido._id}, usuarioASerSeguido);

                return res.status(200).json({msg: 'Deixou de seguir usuario com sucesso'});
            }else{
                const seguidor = {
                    usuarioId: usuarioLogado._id,
                    usuarioSeguidoId: usuarioASerSeguido._id
                }
                await seguidorModel.create(seguidor);
                
                usuarioLogado.seguindo++;
                await usuarioModel.findByIdAndUpdate({_id: usuarioLogado._id}, usuarioLogado);
                
                usuarioASerSeguido.seguidores++;
                await usuarioModel.findByIdAndUpdate({_id: usuarioASerSeguido._id}, usuarioASerSeguido);

                return res.status(200).json({msg: 'Usuario seguido com sucesso'});
            }
        }
        return res.status(405).json({erro: 'Metodo informado invalido'});
    }catch(e){
        console.log(e);
        return res.status(500).json({erro: 'Nao foi possivel seguir/deseguir usuario'});
    };
};

export default politicaCORS(validarTokenJWT(conectarMongoDB(seguirEndpoint)));