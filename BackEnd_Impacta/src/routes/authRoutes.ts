import { Router } from 'express';
import { loginHandler, registerHandler, verifyHandler } from '../controllers/authController';
import { validarCadastro, validarLogin } from '../validators/userValidator';

const router = Router();

router.post('/register', validarCadastro, registerHandler);
router.post('/login', validarLogin, loginHandler);
router.post('/verify', verifyHandler);

export default router;
