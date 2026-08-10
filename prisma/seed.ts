import pkg from "@prisma/client";
const { PrismaClient, Role } = pkg;
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@campusos.com" },
    update: {},
    create: {
      email: "admin@campusos.com",
      passwordHash,
      role: Role.ADMIN,
      hasChangedPassword: true,
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  const bcaDept = await prisma.department.upsert({
    where: { name: "BCA" },
    update: {},
    create: { name: "BCA" },
  });
  console.log(`✅ Department created: ${bcaDept.name}`);

  const facultyUser = await prisma.user.upsert({
    where: { email: "faculty@campusos.com" },
    update: {},
    create: {
      email: "faculty@campusos.com",
      passwordHash,
      role: Role.FACULTY,
    },
  });

  const faculty = await prisma.faculty.upsert({
    where: { id: "EMP-2026-0001" },
    update: {},
    create: {
      id: "EMP-2026-0001",
      userId: facultyUser.id,
      firstName: "Amit",
      lastName: "Sharma",
      email: facultyUser.email,
      departmentId: bcaDept.id,
    },
  });
  console.log(`✅ Faculty created: ${faculty.firstName} ${faculty.lastName}`);

  const batch = await prisma.batch.upsert({
    where: { name: "BCA-11" },
    update: {},
    create: {
      name: "BCA-11",
      departmentId: bcaDept.id,
      coordinatorId: faculty.id,
      academicSession: "2026-29",
      currentSemester: 1,
    },
  });
  console.log(`✅ Batch created: ${batch.name}`);

  const studentUser = await prisma.user.upsert({
    where: { email: "student@campusos.com" },
    update: {},
    create: {
      email: "student@campusos.com",
      passwordHash,
      role: Role.STUDENT,
    },
  });

  const student = await prisma.student.upsert({
    where: { rollNo: "1240211197" },
    update: {},
    create: {
      rollNo: "1240211197",
      userId: studentUser.id,
      firstName: "Rudra",
      lastName: "Tripathi",
      email: studentUser.email,
      phone: "9876543210",
      batchId: batch.id,
    },
  });
  console.log(`✅ Student created: ${student.firstName} ${student.lastName}`);

  console.log("🎉 Seeding finished.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
