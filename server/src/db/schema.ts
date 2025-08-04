
import { serial, text, pgTable, timestamp, integer, pgEnum, date, time, numeric } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'student', 'school_supervisor', 'industry_supervisor']);
export const letterTypeEnum = pgEnum('letter_type', ['agreement', 'introduction', 'monitoring', 'farewell']);
export const placementStatusEnum = pgEnum('placement_status', ['active', 'completed', 'cancelled']);
export const attendanceStatusEnum = pgEnum('attendance_status', ['present', 'absent', 'late', 'sick', 'permission']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  full_name: text('full_name').notNull(),
  role: userRoleEnum('role').notNull(),
  phone: text('phone'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Student profiles table
export const studentProfilesTable = pgTable('student_profiles', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => usersTable.id).notNull(),
  student_id: text('student_id').notNull().unique(),
  class_name: text('class_name').notNull(),
  major: text('major').notNull(),
  academic_year: text('academic_year').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Industries table
export const industriesTable = pgTable('industries', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  address: text('address').notNull(),
  phone: text('phone'),
  email: text('email'),
  contact_person: text('contact_person'),
  description: text('description'),
  quota: integer('quota').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Letters table
export const lettersTable = pgTable('letters', {
  id: serial('id').primaryKey(),
  type: letterTypeEnum('type').notNull(),
  industry_id: integer('industry_id').references(() => industriesTable.id).notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  letter_number: text('letter_number').notNull(),
  date_issued: date('date_issued').notNull(),
  created_by: integer('created_by').references(() => usersTable.id).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Student placements table
export const studentPlacementsTable = pgTable('student_placements', {
  id: serial('id').primaryKey(),
  student_id: integer('student_id').references(() => usersTable.id).notNull(),
  industry_id: integer('industry_id').references(() => industriesTable.id).notNull(),
  school_supervisor_id: integer('school_supervisor_id').references(() => usersTable.id),
  industry_supervisor_id: integer('industry_supervisor_id').references(() => usersTable.id),
  start_date: date('start_date').notNull(),
  end_date: date('end_date').notNull(),
  status: placementStatusEnum('status').notNull().default('active'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Attendance table
export const attendanceTable = pgTable('attendance', {
  id: serial('id').primaryKey(),
  placement_id: integer('placement_id').references(() => studentPlacementsTable.id).notNull(),
  date: date('date').notNull(),
  check_in: time('check_in'),
  check_out: time('check_out'),
  status: attendanceStatusEnum('status').notNull(),
  notes: text('notes'),
  validated_by: integer('validated_by').references(() => usersTable.id),
  validated_at: timestamp('validated_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Journals table
export const journalsTable = pgTable('journals', {
  id: serial('id').primaryKey(),
  placement_id: integer('placement_id').references(() => studentPlacementsTable.id).notNull(),
  date: date('date').notNull(),
  activity: text('activity').notNull(),
  description: text('description').notNull(),
  learning_outcome: text('learning_outcome'),
  validated_by: integer('validated_by').references(() => usersTable.id),
  validated_at: timestamp('validated_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Assessments table
export const assessmentsTable = pgTable('assessments', {
  id: serial('id').primaryKey(),
  placement_id: integer('placement_id').references(() => studentPlacementsTable.id).notNull(),
  assessed_by: integer('assessed_by').references(() => usersTable.id).notNull(),
  technical_skills: numeric('technical_skills', { precision: 5, scale: 2 }).notNull(),
  soft_skills: numeric('soft_skills', { precision: 5, scale: 2 }).notNull(),
  discipline: numeric('discipline', { precision: 5, scale: 2 }).notNull(),
  initiative: numeric('initiative', { precision: 5, scale: 2 }).notNull(),
  teamwork: numeric('teamwork', { precision: 5, scale: 2 }).notNull(),
  final_score: numeric('final_score', { precision: 5, scale: 2 }).notNull(),
  comments: text('comments'),
  assessment_date: date('assessment_date').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(usersTable, ({ one, many }) => ({
  studentProfile: one(studentProfilesTable, {
    fields: [usersTable.id],
    references: [studentProfilesTable.user_id],
  }),
  studentPlacements: many(studentPlacementsTable, { relationName: 'student' }),
  schoolSupervisedPlacements: many(studentPlacementsTable, { relationName: 'schoolSupervisor' }),
  industrySupervisedPlacements: many(studentPlacementsTable, { relationName: 'industrySupervisor' }),
  createdLetters: many(lettersTable),
  validatedAttendance: many(attendanceTable),
  validatedJournals: many(journalsTable),
  assessments: many(assessmentsTable),
}));

export const studentProfilesRelations = relations(studentProfilesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [studentProfilesTable.user_id],
    references: [usersTable.id],
  }),
}));

export const industriesRelations = relations(industriesTable, ({ many }) => ({
  placements: many(studentPlacementsTable),
  letters: many(lettersTable),
}));

export const lettersRelations = relations(lettersTable, ({ one }) => ({
  industry: one(industriesTable, {
    fields: [lettersTable.industry_id],
    references: [industriesTable.id],
  }),
  createdBy: one(usersTable, {
    fields: [lettersTable.created_by],
    references: [usersTable.id],
  }),
}));

export const studentPlacementsRelations = relations(studentPlacementsTable, ({ one, many }) => ({
  student: one(usersTable, {
    fields: [studentPlacementsTable.student_id],
    references: [usersTable.id],
    relationName: 'student',
  }),
  industry: one(industriesTable, {
    fields: [studentPlacementsTable.industry_id],
    references: [industriesTable.id],
  }),
  schoolSupervisor: one(usersTable, {
    fields: [studentPlacementsTable.school_supervisor_id],
    references: [usersTable.id],
    relationName: 'schoolSupervisor',
  }),
  industrySupervisor: one(usersTable, {
    fields: [studentPlacementsTable.industry_supervisor_id],
    references: [usersTable.id],
    relationName: 'industrySupervisor',
  }),
  attendance: many(attendanceTable),
  journals: many(journalsTable),
  assessments: many(assessmentsTable),
}));

export const attendanceRelations = relations(attendanceTable, ({ one }) => ({
  placement: one(studentPlacementsTable, {
    fields: [attendanceTable.placement_id],
    references: [studentPlacementsTable.id],
  }),
  validatedBy: one(usersTable, {
    fields: [attendanceTable.validated_by],
    references: [usersTable.id],
  }),
}));

export const journalsRelations = relations(journalsTable, ({ one }) => ({
  placement: one(studentPlacementsTable, {
    fields: [journalsTable.placement_id],
    references: [studentPlacementsTable.id],
  }),
  validatedBy: one(usersTable, {
    fields: [journalsTable.validated_by],
    references: [usersTable.id],
  }),
}));

export const assessmentsRelations = relations(assessmentsTable, ({ one }) => ({
  placement: one(studentPlacementsTable, {
    fields: [assessmentsTable.placement_id],
    references: [studentPlacementsTable.id],
  }),
  assessedBy: one(usersTable, {
    fields: [assessmentsTable.assessed_by],
    references: [usersTable.id],
  }),
}));

// Export all tables for relation queries
export const tables = {
  users: usersTable,
  studentProfiles: studentProfilesTable,
  industries: industriesTable,
  letters: lettersTable,
  studentPlacements: studentPlacementsTable,
  attendance: attendanceTable,
  journals: journalsTable,
  assessments: assessmentsTable,
};
