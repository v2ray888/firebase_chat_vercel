'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { Conversation } from '@/types';

interface CaseDetailsProps {
  conversation: Conversation;
  onUpdateStatus: (status: 'open' | 'in-progress' | 'resolved') => void;
}

export function CaseDetails({ conversation, onUpdateStatus }: CaseDetailsProps) {
  return (
    <Card className="h-full border-l-0 rounded-l-none">
      <CardHeader>
        <CardTitle className="font-headline">Case Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={conversation.customer.avatar} />
            <AvatarFallback>{conversation.customer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{conversation.customer.name}</p>
            <p className="text-sm text-muted-foreground">{conversation.customer.email}</p>
          </div>
        </div>
        <Separator />
        <div>
          <h4 className="text-sm font-medium mb-2">Case Status</h4>
          <Select value={conversation.case.status} onValueChange={onUpdateStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Set status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
            <h4 className="text-sm font-medium mb-2">Case Summary</h4>
            <p className="text-sm text-muted-foreground">{conversation.case.summary}</p>
        </div>
      </CardContent>
    </Card>
  );
}
