'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Send, X } from "lucide-react";
import { useState } from "react";

interface WidgetPreviewProps {
  primaryColor: string;
  welcomeMessage: string;
}

export function WidgetPreview({ primaryColor, welcomeMessage }: WidgetPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative h-96 w-full rounded-lg bg-muted/30 flex items-center justify-center p-4">
        <div className="absolute bottom-4 right-4">
            {!isOpen && (
                <Button 
                    className="rounded-full h-16 w-16 shadow-lg" 
                    style={{ backgroundColor: primaryColor }}
                    onClick={() => setIsOpen(true)}
                >
                    <MessageSquare className="h-8 w-8 text-primary-foreground" />
                </Button>
            )}
            {isOpen && (
                <Card className="w-80 h-96 flex flex-col shadow-2xl rounded-xl" style={{ borderColor: primaryColor }}>
                    <div className="p-4 rounded-t-xl text-primary-foreground" style={{ backgroundColor: primaryColor }}>
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-bold">NeonSupport</h3>
                                <p className="text-xs">We typically reply in a few minutes.</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setIsOpen(false)}>
                                <X className="h-5 w-5"/>
                            </Button>
                        </div>
                    </div>
                    <CardContent className="flex-1 p-4 space-y-3">
                        <div className="flex items-start gap-2">
                             <div className="p-2 rounded-lg bg-muted text-sm">
                                {welcomeMessage || "Hello! How can we help you today?"}
                            </div>
                        </div>
                    </CardContent>
                    <div className="p-2 border-t">
                        <div className="relative">
                            <input className="w-full border rounded-md p-2 pr-10 text-sm" placeholder="Type a message..."/>
                            <Send className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    </div>
  );
}
