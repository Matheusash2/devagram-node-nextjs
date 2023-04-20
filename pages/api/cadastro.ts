import type { NextApiRequest, NextApiResponse } from "next";
import type { respostaPadraoMsg } from "@/types/respostaPadraoMsg";
import type { cadastroRequisicao } from "@/types/cadastroRequisicao";
import {usuarioModel} from "../../models/usuarioModel";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import md5 from "md5";
import {upload, uploadImagemCosmic} from "../../services/uploadImagemCosmic";
import nc from "next-connect";

const handler = nc()
    .use(upload.single('file'))
    .post(async(req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {
        try {
            const usuario = req.body as cadastroRequisicao;

            if(!usuario.nome || usuario.nome.length < 2){
                return res.status(400).json({erro: 'Nome invalido'});
            }
    
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+(\.[^\s@]+)?$/;
            if(!emailRegex.test(usuario.email)){
                return res.status(400).json({erro: 'Email invalido'});
            }
    
            if(!usuario.senha || usuario.senha.length < 4){
                return res.status(400).json({erro: 'Senha invalida'});
            }
    
            // validacao de usuario com mesmo email
            const usuariosComMesmoEmail = await usuarioModel.find({email: usuario.email});
            if(usuariosComMesmoEmail && usuariosComMesmoEmail.length > 0){
                return res.status(400).json({erro: 'Ja existe conta com usuario informado'});
            }
    
            // enviar imagem do multer para o cosmic
            const image = await uploadImagemCosmic(req);
    
            // salvar no banco de dados
            const usuarioASerSalvo = {
                nome: usuario.nome,
                email: usuario.email,
                senha: md5(usuario.senha),
                avatar: image?.media?.url
            }
            await usuarioModel.create(usuarioASerSalvo);
            return res.status(200).json({msg: 'Usuario criado com sucesso'});
    
        }catch(e){
            console.log(e);
        };
        return res.status(500).json({erro: 'Erro ao cadastrar usuario'});
        
    });

export const config = {
    api:{
        bodyParser:false 
    }
};

export default conectarMongoDB(handler);