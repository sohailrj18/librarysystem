import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { username, password, role, fullname } = await request.json();

  if (!username || !password) {
    return NextResponse.json(
      { message: "Username and password are required" },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (existingUser) {
    return NextResponse.json(
      { message: "Username already exists" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      fullName: fullname,
      role: role ? role : "READER",
    },
  });

  return NextResponse.json(
    { message: "User registered successfully", username: user.username },
    { status: 201 }
  );
}

export async function GET() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      role: true,
      fullName: true,
    },
  });

  return NextResponse.json(users);
}

export async function DELETE(request: NextRequest) {
  const { username } = await request.json();

  if (!username) {
    return NextResponse.json(
      { message: "Username is required" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  await prisma.user.delete({
    where: {
      username,
    },
  });

  return NextResponse.json(
    { message: "User deleted successfully" },
    { status: 200 }
  );
}
