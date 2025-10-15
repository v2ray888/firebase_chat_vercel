'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Send, X, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

interface WidgetPreviewProps {
  primaryColor: string;
  welcomeMessage: string;
  widgetTitle?: string;
  widgetSubtitle?: string;
  autoOpen?: boolean;
  showBranding?: boolean;
  enableImageUpload?: boolean;
}

export function WidgetPreview({ 
  primaryColor, 
  welcomeMessage,
  widgetTitle = "客服支持",
  widgetSubtitle = "我们通常在几分钟内回复",
  autoOpen = false,
  showBranding = true,
  enableImageUpload = true
}: WidgetPreviewProps) {
  const [isOpen, setIsOpen] = useState(autoOpen);

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
                                <h3 className="font-bold">{widgetTitle}</h3>
                                <p className="text-xs">{widgetSubtitle}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setIsOpen(false)}>
                                <X className="h-5 w-5"/>
                            </Button>
                        </div>
                    </div>
                    <CardContent className="flex-1 p-4 space-y-3">
                        <div className="flex items-start gap-2">
                             <div className="p-2 rounded-lg bg-muted text-sm">
                                {welcomeMessage || "您好！我们能为您做些什么？"}
                            </div>
                        </div>
                    </CardContent>
                    <div className="p-2 border-t">
                        <div className="relative flex items-center">
                          {enableImageUpload && (
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 mr-1">
                              <ImageIcon className="h-4 w-4" />
                            </Button>
                          )}
                          <input 
                            className="flex-1 border rounded-md p-2 text-sm" 
                            placeholder="输入消息..."
                            disabled={!enableImageUpload}
                          />
                          <Send className="absolute right-3 h-4 w-4 text-muted-foreground"/>
                        </div>
                        {showBranding && (
                          <div className="text-center text-xs text-muted-foreground mt-1">
                            由 霓虹 提供支持
                          </div>
                        )}
                    </div>
                </Card>
            )}
        </div>
    </div>
  );
}