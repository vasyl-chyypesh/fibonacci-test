import { Router } from 'express';
import { requestValidator } from '../middlewares/requestValidator.js';
import { InputNumber, inputNumberSchema } from './input.schema.js';
import input from './input.js';

const router = Router();

router.post('', requestValidator<InputNumber>(inputNumberSchema), input);

export default router;
