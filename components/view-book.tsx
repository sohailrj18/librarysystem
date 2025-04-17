import React from "react";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { Book } from "@/app/(authenticated)/all-books/page";
import Image from "next/image";

const ViewBook = ({ book }: { book: Book }) => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => {}}>
            <Eye className="h-6 w-6 cursor-pointer" />
          </Button>
        </DialogTrigger>
        <DialogContent
          className="mx-auto max-w-[800px]"
          aria-description="Create New User"
        >
          <DialogHeader>
            <DialogTitle>
              {book.title} [{book.genre}]
            </DialogTitle>
            <DialogDescription>{book.author}</DialogDescription>
          </DialogHeader>
          <Image
            src={book.image}
            alt={book.title}
            width={1024}
            height={1024}
            quality={100}
            className="w-full h-full rounded-md max-h-96 object-contain"
          />
          <span>{book.description}</span>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewBook;
