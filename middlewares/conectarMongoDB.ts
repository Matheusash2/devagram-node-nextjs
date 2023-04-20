import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import mongoose from 'mongoose';
import type {respostaPadraoMsg} from '../types/respostaPadraoMsg'
import { error } from 'console';

export const conectarMongoDB = (handler : NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg | any[]>) => {
        
        // verificar se o banco ja esta conecta, se estiver seguir
        // para o proximo endpoint ou middleware
    if(mongoose.connections[0].readyState) {
        return handler(req, res);
    }
    
    // ja que nao esta conectado vamos conectar
    // obter a variavel de ambiente preenchida do env
    const {DB_CONEXAO_STRING} = process.env

    // se a env estiver vazia aborta o uso do sistema e avisa o programador
    if(!DB_CONEXAO_STRING){
        return res.status(500).json({ erro: 'ENV de configuração do banco, nao informado'});
    }

    mongoose.connection.on('connected', () => console.log('Banco de dados conectado'));
    mongoose.connection.on('error', error => console.log(`Ocorreu um erro ao conectar no banco de dados: ${error}`));
    await mongoose.connect(DB_CONEXAO_STRING);

    //agora posso seguir para o endpoint, pois estou conectado no banco
    return handler(req, res);
}