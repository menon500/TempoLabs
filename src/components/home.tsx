import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";
import RegistrationForm from "./RegistrationForm";
import AdminDashboard from "./AdminDashboard";

interface HomeProps {
  userType?: "admin" | "public";
}

export default function Home({ userType = "public" }: HomeProps) {
  return (
    <div className="min-h-screen bg-background p-6">
      <Card className="max-w-7xl mx-auto bg-card shadow-lg">
        <Tabs defaultValue={userType} className="w-full">
          <TabsList className="w-full justify-start border-b">
            <TabsTrigger value="public">Registration</TabsTrigger>
            <TabsTrigger value="admin">Admin Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="public" className="p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-6">Event Registration</h1>
              <RegistrationForm />
            </div>
          </TabsContent>

          <TabsContent value="admin" className="p-6">
            <AdminDashboard />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
