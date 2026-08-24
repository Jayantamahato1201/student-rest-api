import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  id?: string;
  name: string;
  email: string;
  course: string;
  marks: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const studentSchema = new Schema<IStudent>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address',
      ],
    },
    course: {
      type: String,
      required: [true, 'Course is required'],
      trim: true,
    },
    marks: {
      type: Number,
      required: [true, 'Marks is required'],
      min: [0, 'Marks must be at least 0'],
      max: [100, 'Marks cannot exceed 100'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret: any) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (_, ret: any) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Student = mongoose.model<IStudent>('Student', studentSchema);
