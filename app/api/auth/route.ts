import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/const";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json(
      { message: "Username and password are required" },
      { status: 400 }
    );
  }

  const usersCount = await prisma.user.count();

  if (usersCount === 0) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = await prisma.user.create({
      data: {
        username: username.toString(),
        password: hashedPassword,
        fullName: "Admin",
        role: "ADMIN",
      },
    });
    return Response.json(
      { message: "Admin user created", user: adminUser },
      { status: 201 }
    );
  }

  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });
  if (!user || !(await bcrypt.compare(password, user.password.toString()))) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  if (!JWT_SECRET) {
    return NextResponse.json(
      { message: "JWT_SECRET is not set" },
      { status: 500 }
    );
  }

  const token = jwt.sign({ username: "admin", userId: user.id }, JWT_SECRET, {
    expiresIn: "1d",
  });

  const cookie = serialize("library-system-token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  const response = NextResponse.json(
    {
      message: "Login successful",
      data: { username, id: user.id, role: user.role, fullName: user.fullName },
    },
    { status: 200 }
  );
  response.headers.set("Set-Cookie", cookie);
  return response;
}

export async function GET() {
  const userCount = await prisma.user.count();

  try {
    if (userCount === 0) {
      return NextResponse.json(
        { status: true, message: "No users found" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { status: false, message: "Users Exist" },
        { status: 200 }
      );
    }
  } catch (e: unknown) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
