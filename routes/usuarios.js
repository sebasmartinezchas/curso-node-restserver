const { Router } = require("express");
const { esRoleValido, emailExiste,existeUsuarioPorId } = require("../helpers/db-validators");
const { check } = require("express-validator");
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require("../controllers/usuarios");

const {validarCampos,validarJWT,esAdminRole,tieneRole}=require('../middlewares')
const router = Router();

router.get('/',usuariosGet);
router.put("/:id",[
    check('id','No es un id válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos,
], usuariosPut);

router.post("/",[
check('nombre','El nombre es obligatorio').not().isEmpty(),
check('password','El password es obligatorio y debe de ser de más de 6 letras').isLength({min:6}),
check('correo','El correo ingresado no es válido').isEmail(),
check('correo').custom(emailExiste),
// check('rol','No es un rol permitido').isIn(['ADMIN_ROLE','USER_ROLE']),validarCampos
check('rol').custom(esRoleValido),
validarCampos
], usuariosPost)
router.delete("/:id",[
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
    check('id','No es un id válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos,

], usuariosDelete);

router.patch("/", usuariosPatch);


module.exports = router;
