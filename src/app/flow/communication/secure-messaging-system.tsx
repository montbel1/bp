'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Download, 
  Eye, 
  Clock, 
  Check, 
  CheckCheck, 
  User, 
  Users, 
  Search, 
  Filter, 
  MoreVertical,
  FileText,
  Image,
  Archive,
  Trash2,
  Star,
  Reply,
  Forward,
  Lock,
  Shield,
  Bell,
  Settings
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'client' | 'team_member';
  recipientId: string;
  recipientName: string;
  subject: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  threadId: string;
  attachments: Attachment[];
  isEncrypted: boolean;
  retentionPolicy: string;
  tags: string[];
}

interface Attachment {
  id: string;
  name: string;
  type: 'document' | 'image' | 'spreadsheet' | 'other';
  size: number;
  url: string;
  uploadedBy: string;
  uploadDate: string;
  isEncrypted: boolean;
}

interface Conversation {
  id: string;
  clientId: string;
  clientName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'active' | 'archived' | 'resolved';
  assignedTo: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
}

interface Client {
  id: string;
  name: string;
  email: string;
  companyName: string;
  status: 'active' | 'inactive';
  lastContact: string;
  assignedTo: string;
}

const mockClients: Client[] = [
  { id: '1', name: 'John Smith', email: 'john@acmecorp.com', companyName: 'Acme Corporation', status: 'active', lastContact: '2024-01-15', assignedTo: 'Sarah Johnson' },
  { id: '2', name: 'Maria Garcia', email: 'maria@techstart.com', companyName: 'TechStart Inc', status: 'active', lastContact: '2024-01-14', assignedTo: 'Mike Chen' },
  { id: '3', name: 'David Wilson', email: 'david@globalretail.com', companyName: 'Global Retail', status: 'active', lastContact: '2024-01-13', assignedTo: 'Sarah Johnson' },
];

const mockConversations: Conversation[] = [
  { id: '1', clientId: '1', clientName: 'John Smith', lastMessage: 'When will the Q4 financial statements be ready?', lastMessageTime: '2024-01-15T10:30:00', unreadCount: 2, status: 'active', assignedTo: 'Sarah Johnson', priority: 'high', tags: ['financial_statements', 'urgent'] },
  { id: '2', clientId: '2', clientName: 'Maria Garcia', lastMessage: 'Thank you for the tax planning consultation.', lastMessageTime: '2024-01-14T15:45:00', unreadCount: 0, status: 'active', assignedTo: 'Mike Chen', priority: 'medium', tags: ['tax_planning'] },
  { id: '3', clientId: '3', clientName: 'David Wilson', lastMessage: 'Can you review the new compliance requirements?', lastMessageTime: '2024-01-13T09:15:00', unreadCount: 1, status: 'active', assignedTo: 'Sarah Johnson', priority: 'high', tags: ['compliance', 'review'] },
];

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    senderName: 'John Smith',
    senderType: 'client',
    recipientId: 'team',
    recipientName: 'Sarah Johnson',
    subject: 'Q4 Financial Statements',
    content: 'When will the Q4 financial statements be ready? We have a board meeting next week and need them for review.',
    timestamp: '2024-01-15T10:30:00',
    status: 'read',
    priority: 'high',
    threadId: '1',
    attachments: [
      { id: '1', name: 'Q4_Data.xlsx', type: 'spreadsheet', size: 2048576, url: '#', uploadedBy: 'John Smith', uploadDate: '2024-01-15T10:30:00', isEncrypted: true }
    ],
    isEncrypted: true,
    retentionPolicy: '7_years',
    tags: ['financial_statements', 'urgent']
  },
  {
    id: '2',
    senderId: 'team',
    senderName: 'Sarah Johnson',
    senderType: 'team_member',
    recipientId: '1',
    recipientName: 'John Smith',
    subject: 'Re: Q4 Financial Statements',
    content: 'Hi John, I\'m working on the Q4 statements now. They should be ready by Friday. I\'ll send them over as soon as they\'re complete.',
    timestamp: '2024-01-15T11:00:00',
    status: 'delivered',
    priority: 'high',
    threadId: '1',
    attachments: [],
    isEncrypted: true,
    retentionPolicy: '7_years',
    tags: ['financial_statements', 'response']
  },
];

export default function SecureMessagingSystem() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [messageSubject, setMessageSubject] = useState('');
  const [messagePriority, setMessagePriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [isEncrypted, setIsEncrypted] = useState(true);

  const filteredConversations = mockConversations.filter(conv => {
    const matchesSearch = conv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || conv.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || conv.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const conversationMessages = selectedConversation 
    ? mockMessages.filter(msg => msg.threadId === selectedConversation.id)
    : [];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    // In a real implementation, this would send the message to the backend
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const handleNewMessage = () => {
    if (!selectedClient || !messageSubject || !newMessage.trim()) return;
    
    // In a real implementation, this would create a new conversation and send the message
    console.log('Creating new message:', { selectedClient, messageSubject, newMessage, messagePriority, isEncrypted });
    setShowNewMessageDialog(false);
    setSelectedClient('');
    setMessageSubject('');
    setNewMessage('');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Secure Client Messaging</h1>
            <p className="text-gray-600">Professional communication system for client engagement</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowNewMessageDialog(true)} className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              New Message
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Conversations */}
        <div className="w-80 bg-white border-r flex flex-col">
          {/* Search and Filters */}
          <div className="p-4 border-b">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{conversation.clientName}</h3>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">{new Date(conversation.lastMessageTime).toLocaleDateString()}</span>
                      <Badge 
                        variant={conversation.priority === 'urgent' ? 'destructive' : 
                                conversation.priority === 'high' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {conversation.priority}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {conversation.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Messages */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedConversation ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`/api/avatar/${selectedConversation.clientId}`} />
                      <AvatarFallback>{selectedConversation.clientName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold text-gray-900">{selectedConversation.clientName}</h2>
                      <p className="text-sm text-gray-600">Assigned to: {selectedConversation.assignedTo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedConversation.priority === 'urgent' ? 'destructive' : 'default'}>
                      {selectedConversation.priority}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversationMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderType === 'client' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-md ${message.senderType === 'client' ? 'order-1' : 'order-2'}`}>
                      <div className={`p-3 rounded-lg ${
                        message.senderType === 'client' 
                          ? 'bg-gray-100 text-gray-900' 
                          : 'bg-blue-600 text-white'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-sm">{message.senderName}</span>
                          <span className="text-xs opacity-70">
                            {new Date(message.timestamp).toLocaleString()}
                          </span>
                          {message.isEncrypted && <Lock className="h-3 w-3" />}
                        </div>
                        <div className="mb-2">
                          <h4 className="font-medium text-sm mb-1">{message.subject}</h4>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        
                        {/* Attachments */}
                        {message.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map((attachment) => (
                              <div key={attachment.id} className="flex items-center gap-2 p-2 bg-white/20 rounded">
                                <FileText className="h-4 w-4" />
                                <span className="text-sm flex-1">{attachment.name}</span>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Message Status */}
                        <div className="flex items-center gap-2 mt-2">
                          {message.status === 'sent' && <Clock className="h-3 w-3" />}
                          {message.status === 'delivered' && <Check className="h-3 w-3" />}
                          {message.status === 'read' && <CheckCheck className="h-3 w-3" />}
                          <span className="text-xs opacity-70">{message.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-600">Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Message Dialog */}
      <Dialog open={showNewMessageDialog} onOpenChange={setShowNewMessageDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
            <DialogDescription>
              Send a secure message to a client
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Client</label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {mockClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} - {client.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Subject</label>
              <Input
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                placeholder="Enter message subject"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select value={messagePriority} onValueChange={(value: any) => setMessagePriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="min-h-[100px]"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={isEncrypted}
                onCheckedChange={setIsEncrypted}
              />
              <label className="text-sm font-medium">Encrypt message</label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewMessageDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleNewMessage} disabled={!selectedClient || !messageSubject || !newMessage.trim()}>
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 