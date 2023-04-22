import type { NextApiRequest, NextApiResponse } from "next";
import type { respostaPadraoMsg } from "@/types/respostaPadraoMsg";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { error } from "console";
import { usuarioModel } from "@/models/usuarioModel";
import { json } from "stream/consumers";
import { publicacaoModel } from "@/models/publicacaoModel";
import { seguidorModel } from "@/models/seguidorModel";
import publicacao from "./publicacao";

const feedEndpoint = async(req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg | any>) =>{
    try{
        if(req.method === 'GET'){
            if(req?.query?.id){
                const usuario = await usuarioModel.findById(req?.query?.id);
                if(!usuario){
                    return res.status(400).json({erro:'Usuario nao encontrado'})
                };

                const publicacoes = await publicacaoModel
                    .find({idUsuario: usuario._id})
                    .sort({data: -1});
                
                return res.status(200).json(publicacoes)
            }else{
                const {userId} = req.query;
                const usuarioLogado = await usuarioModel.findById(userId);
                if(!usuarioLogado){
                    return res.status(400).json({erro: 'Usuario nao encontrado'});
                };

                const seguidores = await seguidorModel.find({usuarioId: usuarioLogado._id});
                const seguidoresIds = seguidores.map(s => s.usuarioSeguidoId);
                const publicacoes = await publicacaoModel.find({
                    $or:[{idUsuario: usuarioLogado._id}, 
                        {idUsuario: seguidoresIds}
                    ]
                })
                .sort({data: -1});
                const result = [];
                for(const publicacao of publicacoes){
                    const usuarioDaPublicacao = await usuarioModel.findById(publicacao.idUsuario);
                    if(usuarioDaPublicacao){
                        const final = {...publicacao._doc, usuario:{
                        nome: usuarioDaPublicacao.nome,
                        avatar: usuarioDaPublicacao.avatar}
                        }
                        result.push(final);
                    };
                };
                return res.status(200).json(result);
            }
        };
        return res.status(405).json({erro:'Metodo informado invalido'});

    }catch(e){
        console.log(e);
    };
    return res.status(400).json({erro:'Nao foi possivel obter o feed'})

};

export default validarTokenJWT(conectarMongoDB(feedEndpoint));