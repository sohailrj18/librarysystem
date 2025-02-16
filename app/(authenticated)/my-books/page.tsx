"use client";
import { Button } from "@/components/ui/button";
import React, { useCallback, useEffect, useState } from "react";
import { Book } from "../all-books/page";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Grid, List, Minus } from "lucide-react";
import Image from "next/image";
import ViewBook from "@/components/view-book";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserStore } from "@/hooks/store/use-store";

const MyBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const user = useUserStore((state) => state.user);

  const { toast } = useToast();

  const myBooks = useCallback(async () => {
    if (user === null) {
      return;
    }
    const res = await fetch("/api/mybook?userId=" + user.id);
    const books: Book[] = await res.json();
    setBooks(books);
    setFilteredBooks(books);
  }, [user]);

  const removeFromMyBooks = async (id: string) => {
    if (user === null) {
      return;
    }
    const res = await fetch(`/api/mybook`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, userId: user.id }),
    });

    if (res.ok) {
      toast({
        title: "Book removed from your library",
      });
      myBooks();
    } else {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setFilteredBooks(
      books.filter((book) => book.title.toLowerCase().includes(searchTerm))
    );
  };

  useEffect(() => {
    myBooks();
  }, [myBooks]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold">My Books</h2>
        {/* Grid-List Toggle */}
        <div className="flex gap-4">
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-6 h-6" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
            >
              <List className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
      {/* Search Bar */}
      <div className="flex gap-4">
        <Input
          placeholder="Search..."
          className="w-full"
          onChange={handleSearch}
        />
      </div>
      {/* List of Books */}
      {viewMode === "list" && (
        <Table>
          <TableCaption>A list of My Books.</TableCaption>
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
            {filteredBooks.map((book) => (
              <TableRow key={book.id}>
                <TableCell>
                  <Image
                    src={book.image}
                    alt={book.title}
                    width={32}
                    height={32}
                    className="w-16 h-16 rounded-md object-cover"
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
                      onClick={() => removeFromMyBooks(book.id)}
                    >
                      <Minus className="w-6 h-6" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBooks.map((book) => (
            <Card key={book.id}>
              <CardHeader>
                <CardTitle>
                  {book.title} [{book.author}]
                </CardTitle>
                <CardDescription>{book.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  src={book.image}
                  alt={book.title}
                  width={32}
                  height={32}
                  className="w-64 h-72 rounded-md object-cover"
                />
              </CardContent>
              <CardFooter>
                <div className="flex gap-2 justify-end">
                  <ViewBook book={book} />
                  <Button
                    variant="outline"
                    onClick={() => removeFromMyBooks(book.id)}
                  >
                    <Minus className="w-6 h-6" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBooks;
