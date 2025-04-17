import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }
  const books = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      userBooks: {
        include: {
          book: true,
        },
      },
    },
  });

  return NextResponse.json(
    books?.userBooks.map((book) => book.book),
    {
      status: 200,
    }
  );
}

export async function DELETE(request: Request) {
  const { id, userId } = await request.json();

  const books = await prisma.userBook.delete({
    where: {
      userId_bookId: {
        userId: userId,
        bookId: id,
      },
    },
  });
  return NextResponse.json(books, { status: 200 });
}
