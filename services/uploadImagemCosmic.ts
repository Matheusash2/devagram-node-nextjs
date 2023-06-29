import multer from "multer";
import { createBucketClient } from '@cosmicjs/sdk';

const {
    BUCKET_SLUG,
    BUCKET_READKEY,
    BUCKET_WRITEKEY } = process.env;

const bucketDevagram = createBucketClient({
    bucketSlug: BUCKET_SLUG,
    readKey: BUCKET_READKEY,
    writeKey: BUCKET_WRITEKEY
});

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage
});

const uploadImagemCosmic = async (req: any) => {
    if (req?.file?.originalname) {
        const media_object = {
            originalname: req.file.originalname,
            buffer: req.file.buffer,
        };

        if (req.url && req.url.includes('publicacao')) {
            console.log('Imagem subiu para a pasta [publicacao]')
            return await bucketDevagram.media.insertOne({
                media: media_object,
                folder: 'publicacoes'
            });
        } else {
            console.log('Imagem subiu para a pasta [avatar]')
            return await bucketDevagram.media.insertOne({
                media: media_object,
                folder: 'avatares'
            });
        }
    }
}

export { upload, uploadImagemCosmic };