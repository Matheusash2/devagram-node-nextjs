import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import type { respostaPadraoMsg } from '@/types/respostaPadraoMsg';
import NextCors from 'nextjs-cors';

export const politicaCORS = (handler: NextApiHandler) => 
    async(req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) =>{
        try{
            await NextCors(req, res,{
                origin: '*',
                methods: ['GET', 'PUT', 'POST'],
                optionsSuccessStatus: 200
            })
            return handler(req, res);

        }catch(e){
            console.log('Erro ao tratar politica de CORS', e);
            return res.status(500).json({erro: 'Ocorreu erro ao tratar politica de CORS'});
        }

    };