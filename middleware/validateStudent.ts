import { Request, Response, NextFunction } from 'express';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateStudentPayload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, course, marks } = req.body;
  const errors: string[] = [];

  // Name validation
  if (name === undefined || name === null || (typeof name === 'string' && name.trim() === '')) {
    errors.push('Name is required');
  } else if (typeof name !== 'string') {
    errors.push('Name must be a valid string');
  }

  // Email validation
  if (email === undefined || email === null || (typeof email === 'string' && email.trim() === '')) {
    errors.push('Email is required');
  } else if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('Please provide a valid email format (e.g., student@example.com)');
  }

  // Course validation
  if (course === undefined || course === null || (typeof course === 'string' && course.trim() === '')) {
    errors.push('Course is required');
  } else if (typeof course !== 'string') {
    errors.push('Course must be a valid string');
  }

  // Marks validation
  if (marks === undefined || marks === null || marks === '') {
    errors.push('Marks is required');
  } else {
    const parsedMarks = Number(marks);
    if (isNaN(parsedMarks) || typeof marks === 'boolean') {
      errors.push('Marks must be a valid number');
    } else if (parsedMarks < 0 || parsedMarks > 100) {
      errors.push('Marks must be a number between 0 and 100');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors,
    });
  }

  next();
};
