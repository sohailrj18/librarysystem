"use client";

import CreateNewUser from "@/components/create-new-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
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

type User = Prisma.UserGetPayload<{
  select: { id: true; username: true; role: true; fullName: true };
}>;

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);

  const { toast } = useToast();

  const getUsers = async () => {
    const res = await fetch("/api/user");
    const users: User[] = await res.json();
    setUsers(users);
  };

  const deleteUser = async (username: string) => {
    const res = await fetch("/api/user", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    if (res.ok) {
      toast({
        title: "User Deleted Successfully",
      });
      getUsers();
    } else {
      toast({
        title: "Error deleting user",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold">Users</h2>
        <CreateNewUser getUsers={getUsers} />
      </div>
      {/* Search Bar */}
      <div className="flex gap-4">
        <Input
          placeholder="Search by username"
          className="w-full"
          onChange={(e) =>
            setUsers(
              users.filter((user) => user.username.includes(e.target.value))
            )
          }
        />
      </div>
      {/* List of Users */}
      <Table>
        <TableCaption>A list of users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead className="w-[100px]">Username</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.fullName}</TableCell>
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>{user.role}</TableCell>

              <TableCell className="text-right">
                <Button
                  variant="outline"
                  onClick={() => deleteUser(user.username)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Users;
