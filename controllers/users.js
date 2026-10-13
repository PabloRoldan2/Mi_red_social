// Importar dependencias
const bcrypt = require("bcryptjs");
const mongoosePaginate = require('mongoose-paginate-v2');
const fs = require("fs");

//Importar modelos
const User = require("../models/user");

//Importar servicios
const jwt = require("../services/jwt");

//Acciones de prueba
const pruebaUser = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde controller/users.js",
        usuario: req.user
    });
};

// Registro de usuarios
const register = async (req, res) => {
    try {
        // Recoger datos de la petición
        let params = req.body;

        // Comprobar que me llegan bien (+validación)
        if (!params.name || !params.email || !params.password || !params.nick) {
            return res.status(400).json({
                status: "error",
                message: "Faltan datos por enviar"
            });
        }

        // Control usuarios duplicados
        const users = await User.find({
            $or: [
                { email: params.email.toLowerCase() },
                { nick: params.nick.toLowerCase() }
            ]
        }).exec();

        if (users && users.length >= 1) {
            return res.status(200).send({
                status: "success",
                message: "El usuario ya existe"
            });
        }

        // Cifrar la contraseña 
        let pwd = await bcrypt.hash(params.password, 10);
        params.password = pwd;

        // Crear objeto de usuario
        let user_to_save = new User(params);

        // Guardar usuario en la BD
        const userStored = await user_to_save.save(); // Eliminar callback, usando await

        // Devolver resultado
        return res.status(200).json({
            status: "success",
            message: "Usuario registrado correctamente",
            user: userStored
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error en la consulta de usuarios",
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        // Recoger parámetros del body
        let params = req.body;

        if (!params.email || !params.password) {
            return res.status(400).send({
                status: "error",
                message: "Faltan datos por enviar"
            });
        }

        // Buscar en la BD si existe el email o usuario
        const user = await User.findOne({ email: params.email })
            .select({ name: 1, surname: 1, nick: 1, email: 1, role: 1, image: 1, password: 1 })
            .exec();


        if (!user) {
            return res.status(404).send({
                status: "error",
                message: "No existe el usuario"
            });
        }

        // Comprobar la contraseña
        const coincide = await bcrypt.compare(params.password, user.password);
        if (!coincide) {
            return res.status(400).send({
                status: "error",
                message: "Contraseña incorrecta"
            });
        }

        // Si es necesario, aquí puedes generar un token JWT, por ejemplo:
        const token = jwt.createToken(user);

        // const token = jwt.sign({ id: user._id }, 'tu_secreto', { expiresIn: '1h' });

        // Excluir la contraseña antes de devolver los datos del usuario
        user.password = undefined;

        // Devolver los datos del usuario (y el token si usas JWT)
        return res.status(200).send({
            status: "success",
            message: "Login exitoso",
            user: {
                id: user._id,
                name: user.name,
                surname: user.surname,
                nick: user.nick,
                email: user.email,
                role: user.role,
                image: user.image
            },
            token
        });


    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error en el proceso de login",
            error: error.message
        });
    }
}

const profile = async (req, res) => {
    try {
        // Recibir el parámetro del id de usuario por la URL
        const id = req.params.id;

        // Consulta para obtener los datos del usuario, excluyendo password y role
        const userProfile = await User.findById(id)
            .select({  role: 0, email: 0, nick: 0 })
            .exec();
            
        // Comprobar si el usuario existe
        if (!userProfile) {
            return res.status(404).send({
                status: "error",
                message: "El usuario no existe"
            });
        }

        // Devolver la información del usuario
        return res.status(200).send({
            status: "success",
            user: userProfile
        });

    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al obtener el perfil",
            error: error.message
        });
    }
};


const list = (req, res) => {
    // Controlar en qué página estamos
    let page = req.params.page ? parseInt(req.params.page) : 1;

    // Número de elementos por página
    const itemsPerPage = 5;

    // Opciones de paginación
    const options = {
        page: page,
        limit: itemsPerPage,
        sort: { _id: 1 }
    };

    // Realizar paginación
    User.paginate({}, options)
        .then((users) => {
            if (!users || users.docs.length === 0) {
                return res.status(404).send({
                    status: "error",
                    message: "No hay usuarios disponibles"
                });
            }

            // Devolver el resultado
            return res.status(200).send({
                status: "success",
                users: users.docs,
                totalDocs: users.totalDocs,
                totalPages: users.totalPages,
                currentPage: users.page,
                itemsPerPage: users.limit,
                hasNextPage: users.hasNextPage,
                hasPrevPage: users.hasPrevPage,
                nextPage: users.nextPage,
                prevPage: users.prevPage
            });
        })
        .catch((error) => {
            return res.status(500).send({
                status: "error",
                message: "Error en la consulta de usuarios",
                error: error.message
            });
        });
};


const update = async (req, res) => {
    try {
        //Recoger info del usuario a actualizar
        let userIdentity = req.user;
        console.log("Identidad del usuario desde el token:", userIdentity); // <-- Agrega esto
        let userToUpdate = req.body;

        //Eliminar campos sobrantes
        delete userToUpdate.iat;
        delete userToUpdate.exp;
        delete userToUpdate.role;
        delete userToUpdate.image;

        // Comprobar si los campos email y nick existen antes de aplicar toLowerCase()
        const emailToCheck = userToUpdate.email ? userToUpdate.email.toLowerCase() : null;
        const nickToCheck = userToUpdate.nick ? userToUpdate.nick.toLowerCase() : null;

        // Comprobar si el usuario ya existe
        const users = await User.find({
            $or: [
                { email: emailToCheck },
                { nick: nickToCheck }
            ]
        }).exec();

        let userIsset = false;

        users.forEach(user => {
            if (user && user._id != userIdentity.id) userIsset = true;
        });

        if (userIsset) {
            return res.status(200).send({
                status: "success",
                message: "El usuario ya existe"
            });
        }

        // Cifrar la contraseña si se proporciona
        if (userToUpdate.password) {
            let pwd = await bcrypt.hash(userToUpdate.password, 10);
            userToUpdate.password = pwd;
        }

        // Buscar y actualizar 
        const usuarioActualizado = await User.findByIdAndUpdate(userIdentity.id, userToUpdate, { new: true });

        return res.status(200).send({
            status: "success",
            message: "Usuario actualizado correctamente",
            user: usuarioActualizado
        });

    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: "Error en la conexión",
            error: err.message
        });
    }
}

const upload = async (req, res) => {
    try {
        // Recoger el fichero de imagen y comprobar que existe
        if (!req.file) {
            return res.status(404).send({
                status: "error",
                message: "Petición no incluye imagen"
            });
        }

        // Conseguir el nombre del archivo
        let image = req.file.originalname;

        // Sacar la extensión del archivo
        const imageSplit = image.split("\.");
        const extension = imageSplit[1];

        // Comprobar extensión
        if (extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif") {

            // Borrar archivo subido
            const filePath = req.file.path;
            fs.unlinkSync(filePath); // No es necesario guardar en variable si no se usa después

            // Devolver respuesta negativa
            return res.status(400).send({
                status: "error",
                message: "Extensión del fichero inválida"
            });
        }

        // Si es correcta, guardar imagen en BBDD
        const usuarioActualizado = await User.findOneAndUpdate(
            { _id: req.user.id },
            { image: req.file.filename },
            { new: true }
        );

        if (!usuarioActualizado) {
            return res.status(500).send({
                status: "error",
                message: "Error en la subida del avatar"
            });
        }

        // Devolver respuesta
        return res.status(200).send({
            status: "success",
            user: usuarioActualizado,
            file: req.file,
        });

    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error en el servidor",
            error: error.message
        });
    }
}



module.exports = {
    pruebaUser,
    register,
    login,
    profile,
    list,
    update,
    upload
};