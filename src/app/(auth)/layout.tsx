import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground font-headline">霓虹客服</h1>
        </div>
      {children}
    </div>
  );
}
