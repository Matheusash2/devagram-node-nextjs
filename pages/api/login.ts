import type { NextApiRequest, NextApiResponse } from "next";
import {conectarMongoDB} from '../../middlewares/conectarMongoDB';
import type {respostaPadraoMsg} from "../../types/respostaPadraoMsg";

const endpointLogin = (
    req : NextApiRequest,
    res :NextApiResponse<respostaPadraoMsg>
) => {
    if(req.method === 'POST'){
        const {login, senha} = req.body;

        if(login === 'admin@admin.com' &&
            senha ==='Admin@123'){
                return res.status(200).json({msg : 'Usuario autenticado com sucesso'});
            }
            return res.status(400).json({erro : 'Usuario ou senha nao encontrado'});
    }
    return res.status(405).json({erro : 'Metodo informa nao e valido'})
}

export default conectarMongoDB(endpointLogin);