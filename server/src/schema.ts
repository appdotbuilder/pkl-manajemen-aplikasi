
import { z } from 'zod';

// User roles enum
export const userRoleSchema = z.enum(['admin', 'student', 'school_supervisor', 'industry_supervisor']);
export type UserRole = z.infer<typeof userRoleSchema>;

// User schema
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  password_hash: z.string(),
  full_name: z.string(),
  role: userRoleSchema,
  phone: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Student profile schema
export const studentProfileSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  student_id: z.string(),
  class_name: z.string(),
  major: z.string(),
  academic_year: z.string(),
  created_at: z.coerce.date()
});

export type StudentProfile = z.infer<typeof studentProfileSchema>;

// Industry schema
export const industrySchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  phone: z.string().nullable(),
  email: z.string().email().nullable(),
  contact_person: z.string().nullable(),
  description: z.string().nullable(),
  quota: z.number().int(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Industry = z.infer<typeof industrySchema>;

// Letter types enum
export const letterTypeSchema = z.enum(['agreement', 'introduction', 'monitoring', 'farewell']);
export type LetterType = z.infer<typeof letterTypeSchema>;

// Letter schema
export const letterSchema = z.object({
  id: z.number(),
  type: letterTypeSchema,
  industry_id: z.number(),
  title: z.string(),
  content: z.string(),
  letter_number: z.string(),
  date_issued: z.coerce.date(),
  created_by: z.number(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Letter = z.infer<typeof letterSchema>;

// Student placement schema
export const studentPlacementSchema = z.object({
  id: z.number(),
  student_id: z.number(),
  industry_id: z.number(),
  school_supervisor_id: z.number().nullable(),
  industry_supervisor_id: z.number().nullable(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  status: z.enum(['active', 'completed', 'cancelled']),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type StudentPlacement = z.infer<typeof studentPlacementSchema>;

// Attendance schema
export const attendanceSchema = z.object({
  id: z.number(),
  placement_id: z.number(),
  date: z.coerce.date(),
  check_in: z.string().nullable(), // Time as string (HH:MM)
  check_out: z.string().nullable(), // Time as string (HH:MM)
  status: z.enum(['present', 'absent', 'late', 'sick', 'permission']),
  notes: z.string().nullable(),
  validated_by: z.number().nullable(),
  validated_at: z.coerce.date().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Attendance = z.infer<typeof attendanceSchema>;

// Journal schema
export const journalSchema = z.object({
  id: z.number(),
  placement_id: z.number(),
  date: z.coerce.date(),
  activity: z.string(),
  description: z.string(),
  learning_outcome: z.string().nullable(),
  validated_by: z.number().nullable(),
  validated_at: z.coerce.date().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Journal = z.infer<typeof journalSchema>;

// Assessment schema
export const assessmentSchema = z.object({
  id: z.number(),
  placement_id: z.number(),
  assessed_by: z.number(),
  technical_skills: z.number().min(0).max(100),
  soft_skills: z.number().min(0).max(100),
  discipline: z.number().min(0).max(100),
  initiative: z.number().min(0).max(100),
  teamwork: z.number().min(0).max(100),
  final_score: z.number().min(0).max(100),
  comments: z.string().nullable(),
  assessment_date: z.coerce.date(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Assessment = z.infer<typeof assessmentSchema>;

// Input schemas for creating entities
export const createUserInputSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string(),
  role: userRoleSchema,
  phone: z.string().nullable()
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const createStudentProfileInputSchema = z.object({
  user_id: z.number(),
  student_id: z.string(),
  class_name: z.string(),
  major: z.string(),
  academic_year: z.string()
});

export type CreateStudentProfileInput = z.infer<typeof createStudentProfileInputSchema>;

export const createIndustryInputSchema = z.object({
  name: z.string(),
  address: z.string(),
  phone: z.string().nullable(),
  email: z.string().email().nullable(),
  contact_person: z.string().nullable(),
  description: z.string().nullable(),
  quota: z.number().int().positive()
});

export type CreateIndustryInput = z.infer<typeof createIndustryInputSchema>;

export const createLetterInputSchema = z.object({
  type: letterTypeSchema,
  industry_id: z.number(),
  title: z.string(),
  content: z.string(),
  letter_number: z.string(),
  date_issued: z.coerce.date(),
  created_by: z.number()
});

export type CreateLetterInput = z.infer<typeof createLetterInputSchema>;

export const createStudentPlacementInputSchema = z.object({
  student_id: z.number(),
  industry_id: z.number(),
  school_supervisor_id: z.number().nullable(),
  industry_supervisor_id: z.number().nullable(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date()
});

export type CreateStudentPlacementInput = z.infer<typeof createStudentPlacementInputSchema>;

export const createAttendanceInputSchema = z.object({
  placement_id: z.number(),
  date: z.coerce.date(),
  check_in: z.string().nullable(),
  check_out: z.string().nullable(),
  status: z.enum(['present', 'absent', 'late', 'sick', 'permission']),
  notes: z.string().nullable()
});

export type CreateAttendanceInput = z.infer<typeof createAttendanceInputSchema>;

export const createJournalInputSchema = z.object({
  placement_id: z.number(),
  date: z.coerce.date(),
  activity: z.string(),
  description: z.string(),
  learning_outcome: z.string().nullable()
});

export type CreateJournalInput = z.infer<typeof createJournalInputSchema>;

export const createAssessmentInputSchema = z.object({
  placement_id: z.number(),
  assessed_by: z.number(),
  technical_skills: z.number().min(0).max(100),
  soft_skills: z.number().min(0).max(100),
  discipline: z.number().min(0).max(100),
  initiative: z.number().min(0).max(100),
  teamwork: z.number().min(0).max(100),
  comments: z.string().nullable(),
  assessment_date: z.coerce.date()
});

export type CreateAssessmentInput = z.infer<typeof createAssessmentInputSchema>;

// Update schemas
export const updateAttendanceInputSchema = z.object({
  id: z.number(),
  check_in: z.string().nullable().optional(),
  check_out: z.string().nullable().optional(),
  status: z.enum(['present', 'absent', 'late', 'sick', 'permission']).optional(),
  notes: z.string().nullable().optional()
});

export type UpdateAttendanceInput = z.infer<typeof updateAttendanceInputSchema>;

export const validateAttendanceInputSchema = z.object({
  id: z.number(),
  validated_by: z.number()
});

export type ValidateAttendanceInput = z.infer<typeof validateAttendanceInputSchema>;

export const validateJournalInputSchema = z.object({
  id: z.number(),
  validated_by: z.number()
});

export type ValidateJournalInput = z.infer<typeof validateJournalInputSchema>;
