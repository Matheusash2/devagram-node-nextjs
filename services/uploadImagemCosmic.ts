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
            return await bucketDevagram.media.insertOne({
                media: media_object,
                folder: 'publicacoes'
            });
        } else {
            return await bucketDevagram.media.insertOne({
                media: media_object,
                folder: 'avatares'
            });
        }
    }
}

export { upload, uploadImagemCosmic };