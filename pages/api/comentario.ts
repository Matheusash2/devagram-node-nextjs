import type { NextApiRequest, NextApiResponse } from "next";
import type { respostaPadraoMsg } from "@/types/respostaPadraoMsg";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { usuarioModel } from "@/models/usuarioModel";
import { publicacaoModel } from "@/models/publicacaoModel";

const comentarioEndpoint = async(req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) =>{
    try{
        if(req.method === 'PUT'){
            const {userId, id} = req.query;

            const usuarioLogado = await usuarioModel.findById(userId);
            if(!usuarioLogado){
                return res.status(400).json({erro: 'Usuario nao encontrao'});
            }
            const publicacao = await publicacaoModel.findById(id);
            if(!publicacao){
                return res.status(400).json({erro: 'Publicacao nao encontrada'});
            }
            if(!req.body || !req.body.comentario || req.body.comentario.length < 2){
                return res.status(400).json({erro: 'Comentario invalido'});
            }
            const comentario = {
                usuarioId: usuarioLogado._id,
                nome: usuarioLogado.nome,
                comentario: req.body.comentario
            };

            publicacao.comentarios.push(comentario);
            await publicacaoModel.findByIdAndUpdate({_id: publicacao._id}, publicacao);
            return res.status(200).json({msg: 'Comentario adicionado com sucesso'});

        };
        return res.status(405).json({erro: 'Metodo informado invalido'});
    }catch(e){
        console.log(e);
        return res.status(500).json({erro: 'Ocorreu erro ao adicionar comentario'});
    }
}

export default validarTokenJWT(conectarMongoDB(comentarioEndpoint));