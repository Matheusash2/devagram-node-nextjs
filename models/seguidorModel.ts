import mongoose, {Schema} from 'mongoose';

const seguidorSchema = new Schema({
    // usuario de quem segue
    usuarioId: {type: String, required: true},
    // usuario seguido
    usuarioSeguidoId: {type: String, required: true}
});

export const seguidorModel = (mongoose.models.seguidores || 
    mongoose.model('seguidores', seguidorSchema));