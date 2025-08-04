
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  createUserInputSchema,
  createStudentProfileInputSchema,
  createIndustryInputSchema,
  createLetterInputSchema,
  createStudentPlacementInputSchema,
  createAttendanceInputSchema,
  updateAttendanceInputSchema,
  validateAttendanceInputSchema,
  createJournalInputSchema,
  validateJournalInputSchema,
  createAssessmentInputSchema,
  userRoleSchema,
} from './schema';

// Import handlers
import { createUser } from './handlers/create_user';
import { getUsers } from './handlers/get_users';
import { getUsersByRole } from './handlers/get_users_by_role';
import { createStudentProfile } from './handlers/create_student_profile';
import { getStudentProfiles } from './handlers/get_student_profiles';
import { createIndustry } from './handlers/create_industry';
import { getIndustries } from './handlers/get_industries';
import { createLetter } from './handlers/create_letter';
import { getLetters } from './handlers/get_letters';
import { createStudentPlacement } from './handlers/create_student_placement';
import { getStudentPlacements } from './handlers/get_student_placements';
import { getStudentPlacementByStudent } from './handlers/get_student_placement_by_student';
import { createAttendance } from './handlers/create_attendance';
import { updateAttendance } from './handlers/update_attendance';
import { validateAttendance } from './handlers/validate_attendance';
import { getAttendanceByPlacement } from './handlers/get_attendance_by_placement';
import { createJournal } from './handlers/create_journal';
import { validateJournal } from './handlers/validate_journal';
import { getJournalsByPlacement } from './handlers/get_journals_by_placement';
import { createAssessment } from './handlers/create_assessment';
import { getAssessmentsByPlacement } from './handlers/get_assessments_by_placement';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // User management
  createUser: publicProcedure
    .input(createUserInputSchema)
    .mutation(({ input }) => createUser(input)),
  getUsers: publicProcedure
    .query(() => getUsers()),
  getUsersByRole: publicProcedure
    .input(z.object({ role: userRoleSchema }))
    .query(({ input }) => getUsersByRole(input.role)),

  // Student profiles
  createStudentProfile: publicProcedure
    .input(createStudentProfileInputSchema)
    .mutation(({ input }) => createStudentProfile(input)),
  getStudentProfiles: publicProcedure
    .query(() => getStudentProfiles()),

  // Industry management
  createIndustry: publicProcedure
    .input(createIndustryInputSchema)
    .mutation(({ input }) => createIndustry(input)),
  getIndustries: publicProcedure
    .query(() => getIndustries()),

  // Letter management
  createLetter: publicProcedure
    .input(createLetterInputSchema)
    .mutation(({ input }) => createLetter(input)),
  getLetters: publicProcedure
    .query(() => getLetters()),

  // Student placement management
  createStudentPlacement: publicProcedure
    .input(createStudentPlacementInputSchema)
    .mutation(({ input }) => createStudentPlacement(input)),
  getStudentPlacements: publicProcedure
    .query(() => getStudentPlacements()),
  getStudentPlacementByStudent: publicProcedure
    .input(z.object({ studentId: z.number() }))
    .query(({ input }) => getStudentPlacementByStudent(input.studentId)),

  // Attendance management
  createAttendance: publicProcedure
    .input(createAttendanceInputSchema)
    .mutation(({ input }) => createAttendance(input)),
  updateAttendance: publicProcedure
    .input(updateAttendanceInputSchema)
    .mutation(({ input }) => updateAttendance(input)),
  validateAttendance: publicProcedure
    .input(validateAttendanceInputSchema)
    .mutation(({ input }) => validateAttendance(input)),
  getAttendanceByPlacement: publicProcedure
    .input(z.object({ placementId: z.number() }))
    .query(({ input }) => getAttendanceByPlacement(input.placementId)),

  // Journal management
  createJournal: publicProcedure
    .input(createJournalInputSchema)
    .mutation(({ input }) => createJournal(input)),
  validateJournal: publicProcedure
    .input(validateJournalInputSchema)
    .mutation(({ input }) => validateJournal(input)),
  getJournalsByPlacement: publicProcedure
    .input(z.object({ placementId: z.number() }))
    .query(({ input }) => getJournalsByPlacement(input.placementId)),

  // Assessment management
  createAssessment: publicProcedure
    .input(createAssessmentInputSchema)
    .mutation(({ input }) => createAssessment(input)),
  getAssessmentsByPlacement: publicProcedure
    .input(z.object({ placementId: z.number() }))
    .query(({ input }) => getAssessmentsByPlacement(input.placementId)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`PKL Management System TRPC server listening at port: ${port}`);
}

start();
