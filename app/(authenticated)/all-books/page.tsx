"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AddNewBook from "@/components/add-new-book";
import { Prisma } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import ViewBook from "@/components/view-book";
import { Plus, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/hooks/store/use-store";

export type Book = Prisma.BookGetPayload<{
  select: {
    id: true;
    title: true;
    author: true;
    description: true;
    genre: true;
    image: true;
    data: true;
  };
}>;

const AddBook = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const user = useUserStore((state) => state.user);

  const { toast } = useToast();

  const getBooks = async () => {
    const res = await fetch("/api/book");
    const books: Book[] = await res.json();
    setBooks(books);
  };

  const deleteBook = async (id: string) => {
    const res = await fetch("/api/book", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      toast({
        title: "Book Deleted Successfully",
      });
      getBooks();
    } else {
      toast({
        title: "Error deleting book",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const addToMyBooks = async (id: string) => {
    if (user === null) {
      return;
    }
    const res = await fetch("/api/book", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, userId: user.id }),
    });

    if (res.ok) {
      toast({
        title: "Book Added Successfully",
      });
      getBooks();
    } else {
      toast({
        title: "Error adding book",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold">Books</h2>
        <AddNewBook />
      </div>
      {/* Search Bar */}
      <div className="flex gap-4">
        <Input
          placeholder="Search..."
          className="w-full"
          onChange={(e) =>
            setBooks(
              books.filter((user) =>
                user.title.toLowerCase().includes(e.target.value.toLowerCase())
              )
            )
          }
        />
      </div>
      {/* List of Books */}
      <Table>
        <TableCaption>A list of books.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Cover</TableHead>
            <TableHead className="w-[100px]">Book Name</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead className="text-right font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell>
                <Image
                  src={book.image}
                  alt={book.title}
                  width={1024}
                  height={1024}
                  quality={100}
                  className="w-16 h-24 rounded-md object-cover"
                />
              </TableCell>
              <TableCell className="font-medium">{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.genre}</TableCell>
              <TableCell className="text-right ">
                <div className="flex gap-2 justify-end">
                  <ViewBook book={book} />
                  <Button
                    variant="outline"
                    onClick={() => addToMyBooks(book.id)}
                  >
                    <Plus className="h-6 w-6" />
                  </Button>
                  <Button variant="outline" onClick={() => deleteBook(book.id)}>
                    <Trash className="h-6 w-6" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AddBook;
