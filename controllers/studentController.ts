import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Student } from '../models/Student';
import { getIsConnected } from '../config/db';

// Fallback in-memory store for environments without an active MongoDB connection
interface MockStudent {
  id: string;
  name: string;
  email: string;
  course: string;
  marks: number;
  createdAt: string;
  updatedAt: string;
}

let mockStudents: MockStudent[] = [
  {
    id: '64f1a2b3c4d5e6f7a8b9c0d1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    course: 'Computer Science',
    marks: 88,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: '64f1a2b3c4d5e6f7a8b9c0d2',
    name: 'Diya Patel',
    email: 'diya.patel@example.com',
    course: 'Information Technology',
    marks: 94,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '64f1a2b3c4d5e6f7a8b9c0d3',
    name: 'Rohan Verma',
    email: 'rohan.verma@example.com',
    course: 'Data Science',
    marks: 76,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Helper to check valid MongoDB ObjectID format
const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

// GET /api/students - Retrieve all students
export const getStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (getIsConnected()) {
      const students = await Student.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: students.length,
        data: students,
      });
    }

    // Fallback store
    res.status(200).json({
      success: true,
      count: mockStudents.length,
      data: mockStudents,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/students/:id - Retrieve a single student by ID
export const getStudentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id) && !id.startsWith('mock-')) {
      return res.status(400).json({
        success: false,
        error: `Invalid student ID format: ${id}`,
      });
    }

    if (getIsConnected()) {
      const student = await Student.findById(id);
      if (!student) {
        return res.status(404).json({
          success: false,
          error: `Student with ID ${id} not found`,
        });
      }
      return res.status(200).json({
        success: true,
        data: student,
      });
    }

    // Fallback store
    const student = mockStudents.find((s) => s.id === id);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: `Student with ID ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/students - Create a new student
export const createStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, course, marks } = req.body;

    if (getIsConnected()) {
      const newStudent = await Student.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        course: course.trim(),
        marks: Number(marks),
      });

      return res.status(201).json({
        success: true,
        message: 'Student created successfully',
        data: newStudent,
      });
    }

    // Fallback store
    const newStudent: MockStudent = {
      id: new mongoose.Types.ObjectId().toHexString(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      course: course.trim(),
      marks: Number(marks),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockStudents.unshift(newStudent);

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: newStudent,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/students/:id - Update an existing student
export const updateStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, email, course, marks } = req.body;

    if (!isValidObjectId(id) && !id.startsWith('mock-')) {
      return res.status(400).json({
        success: false,
        error: `Invalid student ID format: ${id}`,
      });
    }

    if (getIsConnected()) {
      const updatedStudent = await Student.findByIdAndUpdate(
        id,
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          course: course.trim(),
          marks: Number(marks),
        },
        { new: true, runValidators: true }
      );

      if (!updatedStudent) {
        return res.status(404).json({
          success: false,
          error: `Student with ID ${id} not found`,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Student updated successfully',
        data: updatedStudent,
      });
    }

    // Fallback store
    const index = mockStudents.findIndex((s) => s.id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: `Student with ID ${id} not found`,
      });
    }

    mockStudents[index] = {
      ...mockStudents[index],
      name: name.trim(),
      email: email.trim().toLowerCase(),
      course: course.trim(),
      marks: Number(marks),
      updatedAt: new Date().toISOString(),
    };

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: mockStudents[index],
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/students/:id - Delete a student by ID
export const deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id) && !id.startsWith('mock-')) {
      return res.status(400).json({
        success: false,
        error: `Invalid student ID format: ${id}`,
      });
    }

    if (getIsConnected()) {
      const deletedStudent = await Student.findByIdAndDelete(id);
      if (!deletedStudent) {
        return res.status(404).json({
          success: false,
          error: `Student with ID ${id} not found`,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Student deleted successfully',
        data: { id },
      });
    }

    // Fallback store
    const index = mockStudents.findIndex((s) => s.id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: `Student with ID ${id} not found`,
      });
    }

    const removed = mockStudents.splice(index, 1)[0];

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
      data: { id: removed.id },
    });
  } catch (error) {
    next(error);
  }
};
