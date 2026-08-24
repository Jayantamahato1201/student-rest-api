import { Router } from 'express';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/studentController';
import { validateStudentPayload } from '../middleware/validateStudent';

const router = Router();

// Route: /api/students
router
  .route('/')
  .get(getStudents)
  .post(validateStudentPayload, createStudent);

// Route: /api/students/:id
router
  .route('/:id')
  .get(getStudentById)
  .put(validateStudentPayload, updateStudent)
  .delete(deleteStudent);

export default router;
