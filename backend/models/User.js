import mongoose from "mongoose";

const UsersShema=new mongoose.Schema({
    Nombre:{type:String,required:true},
    Apellido:{type:String,required:true},
    telefono:{type:String,required:true,minlength:10},
    Correo_Electronico:{type:String,required:true},
    passwords:{type:String,required:true},
    rol: {type: String, enum: ['user', 'admin'], 
        default: 'user'
        
    },
   codigoRecuperacion: String,
   codigoExpiracion: Date
   

});
// forzar que guarde en Users
const Users = mongoose.model("Users",UsersShema,"Users")

export default Users;