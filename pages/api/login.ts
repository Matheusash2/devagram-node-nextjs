import type { NextApiRequest, NextApiResponse } from "next";
import {conectarMongoDB} from '../../middlewares/conectarMongoDB';
import type {respostaPadraoMsg} from "../../types/respostaPadraoMsg";
import { usuarioModel } from "@/models/usuarioModel";
import md5 from "md5";

const endpointLogin = async (
    req : NextApiRequest,
    res :NextApiResponse<respostaPadraoMsg>
) => {
    if(req.method === 'POST'){
        const {login, senha} = req.body;

        const usuariosEncontrados = await usuarioModel.find({ email: login, senha: md5(senha)});
        if(usuariosEncontrados && usuariosEncontrados.length > 0){
            const usuarioEncontrado = usuariosEncontrados[0];
            return res.status(200).json({msg : `Usuario ${usuarioEncontrado.nome} autenticado com sucesso`});
        }
        return res.status(400).json({erro : 'Usuario ou senha nao encontrado'});
    }
    return res.status(405).json({erro : 'Metodo informa nao e valido'})
}

export default conectarMongoDB(endpointLogin);