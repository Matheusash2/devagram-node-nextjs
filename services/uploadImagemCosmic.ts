import multer from "multer";
import cosmicjs from "cosmicjs";

const {CHAVE_GRAVACAO_AVATARES,
    CHAVE_GRAVACAO_PUBLICACOES,
    BUCKET_AVATARES,
    BUCKET_PUBLICACOES} = process.env

const cosmic = cosmicjs();

const bucketAvatres = cosmic.bucket ({
    slug: BUCKET_AVATARES,
    write_key: CHAVE_GRAVACAO_AVATARES
});

const bucketPublicacoes = cosmic.bucket ({
    slug: BUCKET_PUBLICACOES,
    write_key: CHAVE_GRAVACAO_PUBLICACOES
});

const storage = multer.memoryStorage();
const upload = multer({storage: storage});

const uploadImagemCosmic = async(req: any) => {
    if(req?.file?.originalname){
        const media_object = {
            originalname: req.file.originalname,
            buffer: req.file.buffer
        };
    
        if(req.url && req.url.includes('publicacao')){
            return await bucketPublicacoes.addMedia({media: media_object})
        }else{
            return await bucketAvatres.addMedia({media: media_object}); 
        }
        
    }
}

export {upload, uploadImagemCosmic};