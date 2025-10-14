'use client';

import { WidgetPreview } from "@/components/settings/widget-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function SettingsPage() {
    const { toast } = useToast();
    const [primaryColor, setPrimaryColor] = useState('#64B5F6');
    const [welcomeMessage, setWelcomeMessage] = useState('Hello! How can we help you today?');
    const [offlineMessage, setOfflineMessage] = useState('We are currently away. Please leave a message and we will get back to you.');

    const handleSaveChanges = () => {
        toast({
            title: "Settings saved",
            description: "Your changes have been successfully saved.",
        });
    }

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <h1 className="text-3xl font-bold font-headline mb-6">Settings</h1>
            <Tabs defaultValue="appearance">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="availability">Availability</TabsTrigger>
                    <TabsTrigger value="responses">Automated Responses</TabsTrigger>
                </TabsList>

                <TabsContent value="appearance">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Widget Customization</CardTitle>
                                <CardDescription>Customize the look and feel of your chat widget.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="primary-color">Primary Color</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="primary-color-hex"
                                            value={primaryColor}
                                            onChange={(e) => setPrimaryColor(e.target.value)}
                                            className="w-32"
                                        />
                                        <Input
                                            id="primary-color"
                                            type="color"
                                            value={primaryColor}
                                            onChange={(e) => setPrimaryColor(e.target.value)}
                                            className="w-10 h-10 p-1"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                             <CardHeader>
                                <CardTitle>Widget Preview</CardTitle>
                                <CardDescription>This is how your widget will appear to customers.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <WidgetPreview primaryColor={primaryColor} welcomeMessage={welcomeMessage} />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                
                <TabsContent value="availability">
                    <Card>
                        <CardHeader>
                            <CardTitle>Agent Availability</CardTitle>
                            <CardDescription>Set your team's online hours and offline status.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Accepting new chats</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Turn this off to appear offline to new visitors.
                                    </p>
                                </div>
                                <Switch defaultChecked/>
                            </div>
                            <div className="space-y-2">
                                <Label>Office Hours (Coming Soon)</Label>
                                <p className="text-sm text-muted-foreground">
                                    Automatically set your availability based on a schedule. This feature is planned for a future update.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="responses">
                    <Card>
                        <CardHeader>
                            <CardTitle>Automated Chat Responses</CardTitle>
                            <CardDescription>Set up messages that send automatically in certain situations.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="welcome-message">Welcome Message</Label>
                                <Textarea
                                    id="welcome-message"
                                    placeholder="Enter a welcome message..."
                                    value={welcomeMessage}
                                    onChange={(e) => setWelcomeMessage(e.target.value)}
                                />
                                <p className="text-sm text-muted-foreground">This message is sent when a customer first opens the chat.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="offline-message">Offline Message</Label>
                                <Textarea
                                    id="offline-message"
                                    placeholder="Enter an offline message..."
                                    value={offlineMessage}
                                    onChange={(e) => setOfflineMessage(e.target.value)}
                                />
                                <p className="text-sm text-muted-foreground">This message is shown if a customer tries to chat when you're offline.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            <div className="mt-6 flex justify-end">
                <Button onClick={handleSaveChanges} className="bg-accent hover:bg-accent/90 text-accent-foreground">Save Changes</Button>
            </div>
        </div>
    )
}
