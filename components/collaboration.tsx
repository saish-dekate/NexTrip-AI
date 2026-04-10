'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Share2, Users, Copy, Check, Mail, Link as LinkIcon, Vote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  avatar?: string;
}

interface CollaborationProps {
  shareToken: string;
  collaborators: Collaborator[];
  onInvite: (email: string) => void;
  className?: string;
}

export function CollaborationPanel({ shareToken, collaborators, onInvite, className }: CollaborationProps) {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/trip/${shareToken}` 
    : '';

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onInvite(email);
      setEmail('');
      setShowInvite(false);
    }
  };

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Collaboration
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Share Link</label>
          <div className="flex gap-2">
            <Input
              value={shareUrl}
              readOnly
              className="flex-1"
            />
            <Button variant="outline" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={() => setShowInvite(!showInvite)}>
          <Mail className="h-4 w-4 mr-2" />
          Invite Collaborators
        </Button>

        {showInvite && (
          <form onSubmit={handleInvite} className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Invite</Button>
          </form>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Team Members</label>
          <div className="space-y-2">
            {collaborators.map((collaborator) => (
              <div key={collaborator.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  {collaborator.avatar ? (
                    <img src={collaborator.avatar} alt={collaborator.name} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm">
                      {collaborator.name[0]}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">{collaborator.name}</p>
                    <p className="text-xs text-muted-foreground">{collaborator.email}</p>
                  </div>
                </div>
                <Badge variant={collaborator.role === 'owner' ? 'default' : 'secondary'}>
                  {collaborator.role}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface VotingPanelProps {
  proposals: {
    id: string;
    title: string;
    description: string;
    votes: number;
    hasVoted: boolean;
  }[];
  onVote: (proposalId: string) => void;
  className?: string;
}

export function VotingPanel({ proposals, onVote, className }: VotingPanelProps) {
  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Vote className="h-5 w-5" />
          Vote on Activities
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {proposals.map((proposal) => (
          <div key={proposal.id} className="p-4 border rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium">{proposal.title}</h4>
                <p className="text-sm text-muted-foreground">{proposal.description}</p>
              </div>
              <Badge variant={proposal.hasVoted ? 'default' : 'outline'}>
                {proposal.votes} votes
              </Badge>
            </div>
            <Button
              variant={proposal.hasVoted ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => onVote(proposal.id)}
              className="w-full"
            >
              {proposal.hasVoted ? 'Voted' : 'Vote for this'}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
