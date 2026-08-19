import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Prisma seeding for NotifyHub...');

  // Clean existing data
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.query.deleteMany();
  await prisma.event.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.user.deleteMany();

  // Create Users with hashed passwords
  const passwordHash = await bcrypt.hash('admin123', 10);
  const hodPasswordHash = await bcrypt.hash('hod123', 10);
  const facultyPasswordHash = await bcrypt.hash('faculty123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Dr. Arthur Pendelton',
      email: 'admin@notifyhub.com',
      passwordHash,
      role: 'ADMIN',
      department: 'Administration',
    },
  });

  const hod = await prisma.user.create({
    data: {
      name: 'Prof. Sarah Jenkins',
      email: 'hod@notifyhub.com',
      passwordHash: hodPasswordHash,
      role: 'HOD',
      department: 'Computer Science',
    },
  });

  const faculty = await prisma.user.create({
    data: {
      name: 'Dr. Rajesh Kumar',
      email: 'faculty@notifyhub.com',
      passwordHash: facultyPasswordHash,
      role: 'FACULTY',
      department: 'Computer Science',
    },
  });

  console.log('✅ Users created: Admin, HOD, Faculty');

  // Seed Announcements
  const now = new Date();
  const day = (d) => new Date(now.getTime() + d * 86400000);

  const announcements = await Promise.all([
    prisma.announcement.create({
      data: {
        title: '🚨 CRITICAL: End Semester Examination Timetable Released (Fall 2026)',
        description: 'The final timetable for end-semester exams has been published. All students must check their student portal for seat allocation and exam center rules. No electronic devices permitted in hall.',
        category: 'EXAM',
        priority: 'URGENT',
        status: 'PUBLISHED',
        targetDepartment: 'ALL',
        targetYear: 'ALL',
        publishedAt: day(-1),
        createdById: admin.id,
      },
    }),
    prisma.announcement.create({
      data: {
        title: '💼 Campus Placement Drive: Google & Microsoft On-Campus Recruitment',
        description: 'Placement registration is now open for Final Year (4th Year) B.Tech students in CSE, IT, ECE. Submit your updated resumes before August 25th on the portal.',
        category: 'PLACEMENT',
        priority: 'IMPORTANT',
        status: 'PUBLISHED',
        targetDepartment: 'Computer Science',
        targetYear: '4th Year',
        publishedAt: day(-2),
        createdById: hod.id,
      },
    }),
    prisma.announcement.create({
      data: {
        title: '🤖 Hands-On Workshop: Deep Learning with PyTorch & Gemini 3.6',
        description: 'Organized by the Department of Computer Science. Join us for a 2-day intensive practical session covering Transformer Architectures and AI Agents.',
        category: 'WORKSHOP',
        priority: 'NORMAL',
        status: 'PUBLISHED',
        targetDepartment: 'Computer Science',
        targetYear: '3rd Year',
        publishedAt: day(-3),
        createdById: faculty.id,
      },
    }),
    prisma.announcement.create({
      data: {
        title: '📢 Academic Calendar Update: Mid-Semester Break Schedule',
        description: 'The campus will remain closed for Mid-Semester break from September 10th to September 15th. Library services will be available online.',
        category: 'ACADEMIC',
        priority: 'NORMAL',
        status: 'PUBLISHED',
        targetDepartment: 'ALL',
        targetYear: 'ALL',
        publishedAt: day(-4),
        createdById: admin.id,
      },
    }),
    prisma.announcement.create({
      data: {
        title: '🏆 Annual Intra-College Sports Meet "Ignite 2026" Registrations Open',
        description: 'Registrations are open for Football, Basketball, Badminton, and Chess tournaments. Contact your department sports coordinator to form teams.',
        category: 'EVENT',
        priority: 'NORMAL',
        status: 'PUBLISHED',
        targetDepartment: 'ALL',
        targetYear: 'ALL',
        publishedAt: day(-5),
        createdById: faculty.id,
      },
    }),
  ]);

  console.log(`✅ ${announcements.length} Announcements created`);

  // Seed Events
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: '🚀 Hackathon 2026: AI & Campus Automation Challenge',
        description: '36-Hour continuous hackathon to build solutions for campus life, smart learning, and institutional notifications. Cash prizes total $5,000!',
        startDate: day(5),
        endDate: day(6),
        venue: 'Main Auditorium & Innovation Lab',
        organizer: 'Tech Club & CSE Department',
        registrationDeadline: day(3),
        registrationStatus: 'OPEN',
        targetDepartment: 'ALL',
        targetYear: 'ALL',
        createdById: hod.id,
      },
    }),
    prisma.event.create({
      data: {
        title: '🎓 Guest Lecture: Scalable Distributed Systems in Practice',
        description: 'Distinguished lecture by Lead Architect from AWS on cloud infrastructure, microservices, and fault tolerance.',
        startDate: day(8),
        endDate: day(8),
        venue: 'Seminar Hall B',
        organizer: 'Department of Computer Science',
        registrationDeadline: day(7),
        registrationStatus: 'OPEN',
        targetDepartment: 'Computer Science',
        targetYear: '3rd Year',
        createdById: faculty.id,
      },
    }),
    prisma.event.create({
      data: {
        title: '🎨 Cultural Fest "Kala-Sangam 2026"',
        description: 'Annual cultural extravaganza featuring music, dance, drama, art exhibitions, and celebrity guest band performances.',
        startDate: day(14),
        endDate: day(16),
        venue: 'Campus Amphitheatre',
        organizer: 'Student Activity Center',
        registrationDeadline: day(12),
        registrationStatus: 'OPEN',
        targetDepartment: 'ALL',
        targetYear: 'ALL',
        createdById: admin.id,
      },
    }),
  ]);

  console.log(`✅ ${events.length} Events created`);

  // Seed Student Queries
  const queries = await Promise.all([
    prisma.query.create({
      data: {
        subject: 'Discrepancy in Mid-Sem Exam Marks (CSE-301 Data Structures)',
        description: 'Respected Sir, I received 22/30 in my DS mid-term paper, but according to the answer key I should have scored 26. Could you please re-evaluate Question 4(b)?',
        category: 'EXAM',
        status: 'IN_PROGRESS',
        studentName: 'Alex Rivera',
        studentEmail: 'alex.rivera@student.edu',
        studentId: 'CS2023-089',
        assignedToId: faculty.id,
        response: 'Hello Alex, your paper has been pulled for review. Please meet me during office hours tomorrow between 2-4 PM.',
      },
    }),
    prisma.query.create({
      data: {
        subject: 'Hostel Wi-Fi Connectivity and Bandwidth Drop in Block C',
        description: 'The Wi-Fi speed in Block C room 302 has been dropping significantly during peak study hours (8 PM - 11 PM). Requesting IT department check router node #4.',
        category: 'GENERAL',
        status: 'OPEN',
        studentName: 'Maya Sharma',
        studentEmail: 'maya.s@student.edu',
        studentId: 'EC2024-042',
      },
    }),
    prisma.query.create({
      data: {
        subject: 'Placement Portal Resume Verification Status Pending',
        description: 'My uploaded PDF resume for Google placement drive is still showing "Pending Approval". Need urgent verification before registration deadline.',
        category: 'PLACEMENT',
        status: 'RESOLVED',
        studentName: 'David Chen',
        studentEmail: 'd.chen@student.edu',
        studentId: 'CS2022-114',
        assignedToId: hod.id,
        response: 'Verified and approved on portal. Good luck with the placement process!',
        resolvedAt: day(-1),
      },
    }),
  ]);

  console.log(`✅ ${queries.length} Queries created`);

  // Seed Notifications
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        title: '🚨 CRITICAL ANNOUNCEMENT',
        message: 'End Semester Examination Timetable Released (Fall 2026)',
        type: 'URGENT',
        isRead: false,
        relatedId: announcements[0].id,
      },
    }),
    prisma.notification.create({
      data: {
        title: '💼 New Placement Opportunity',
        message: 'Google & Microsoft On-Campus Recruitment drive announced!',
        type: 'ANNOUNCEMENT',
        isRead: false,
        relatedId: announcements[1].id,
      },
    }),
    prisma.notification.create({
      data: {
        title: '🚀 New Campus Event',
        message: 'Hackathon 2026 registration is now open with $5,000 cash prizes!',
        type: 'EVENT',
        isRead: true,
        relatedId: events[0].id,
      },
    }),
  ]);

  console.log(`✅ ${notifications.length} Notifications created`);

  // Seed Activity Logs
  await prisma.activityLog.createMany({
    data: [
      {
        userId: admin.id,
        action: 'CREATE_ANNOUNCEMENT',
        entity: 'Announcement',
        entityId: announcements[0].id,
        details: 'Published Urgent Notice: End Semester Exam Timetable',
      },
      {
        userId: hod.id,
        action: 'CREATE_EVENT',
        entity: 'Event',
        entityId: events[0].id,
        details: 'Created Event: Hackathon 2026',
      },
      {
        userId: faculty.id,
        action: 'UPDATE_QUERY',
        entity: 'Query',
        entityId: queries[0].id,
        details: 'Responded to student query CS2023-089',
      },
    ],
  });

  console.log('✅ Activity logs created');
  console.log('🎉 Seeding complete successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
