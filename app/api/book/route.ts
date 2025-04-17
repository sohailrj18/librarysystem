import { IMGBB_API_KEY } from "@/const";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const description = formData.get("description") as string;
  const genre = formData.get("genre") as string;
  const image = formData.get("image") as File;

  if (!title || !author || !description || !genre || !image) {
    return NextResponse.json(
      {
        message: "Title, author, description, genre, and image are required",
      },
      {
        status: 400,
      }
    );
  }

  const imageBody = new FormData();
  imageBody.append("image", image);
  const imageUploadResponse = await fetch(
    `https://api.imgbb.com/1/upload?expiration=600&key=${IMGBB_API_KEY}`,
    {
      method: "POST",
      body: imageBody,
    }
  );
  const result = await imageUploadResponse.json();

  const book = await prisma.book.create({
    data: {
      title,
      author,
      description,
      genre,
      image: result.data.url ?? "",
    },
  });

  return NextResponse.json(book, { status: 201 });
}

export async function GET() {
  const books = await prisma.book.findMany({
    select: {
      id: true,
      title: true,
      author: true,
      description: true,
      genre: true,
      image: true,
    },
  });

  return NextResponse.json(books, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  const book = await prisma.book.findUnique({
    where: {
      id: id,
    },
  });

  if (!book) {
    return NextResponse.json({ message: "Book not found" }, { status: 404 });
  }

  await prisma.book.delete({
    where: {
      id: id,
    },
  });

  return NextResponse.json(
    { message: "Book deleted successfully" },
    { status: 200 }
  );
}

export async function PUT(request: NextRequest) {
  const { id, userId } = await request.json();
  const userBooks = await prisma.userBook.findMany({
    where: {
      userId: userId,
    },
  });

  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  const book = await prisma.book.findUnique({
    where: {
      id: id,
    },
  });

  if (!book) {
    return NextResponse.json({ message: "Book not found" }, { status: 404 });
  }

  const bookIndex = userBooks.findIndex((book) => book.bookId === id);

  if (bookIndex === -1) {
    await prisma.userBook.create({
      data: {
        userId: userId,
        bookId: id,
      },
    });
    return NextResponse.json(
      { message: "Book added to my books successfully" },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { message: "Book already added to my books" },
      { status: 200 }
    );
  }
}
