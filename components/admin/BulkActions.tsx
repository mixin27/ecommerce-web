'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const BULK_UPDATE_USERS = gql`
  mutation BulkUpdateUsers($userIds: [ID!]!, $input: BulkUpdateUsersInput!) {
    bulkUpdateUsers(userIds: $userIds, input: $input) {
      success
      updatedCount
    }
  }
`;

const BULK_DELETE_USERS = gql`
  mutation BulkDeleteUsers($userIds: [ID!]!) {
    bulkDeleteUsers(userIds: $userIds) {
      success
      deletedCount
    }
  }
`;

interface BulkActionsProps {
  selectedUsers: string[];
  onComplete: () => void;
  onClearSelection: () => void;
}

export default function BulkActions({
  selectedUsers,
  onComplete,
  onClearSelection,
}: BulkActionsProps) {
  const [action, setAction] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionValue, setActionValue] = useState('');

  const [bulkUpdate, { loading: updating }] = useMutation(BULK_UPDATE_USERS, {
    onCompleted: () => {
      alert('Users updated successfully');
      onComplete();
      onClearSelection();
      setConfirmDialogOpen(false);
    },
    onError: (error) => {
      console.error('Bulk update error:', error);
      alert('Failed to update users');
    },
  });

  const [bulkDelete, { loading: deleting }] = useMutation(BULK_DELETE_USERS, {
    onCompleted: () => {
      alert('Users deleted successfully');
      onComplete();
      onClearSelection();
      setConfirmDialogOpen(false);
    },
    onError: (error) => {
      console.error('Bulk delete error:', error);
      alert('Failed to delete users');
    },
  });

  const handleActionChange = (value: string) => {
    setAction(value);
    if (value === 'delete') {
      setConfirmDialogOpen(true);
    }
  };

  const handleApply = () => {
    if (action === 'activate' || action === 'deactivate') {
      setConfirmDialogOpen(true);
    } else if (action === 'change-role') {
      setConfirmDialogOpen(true);
    }
  };

  const handleConfirm = async () => {
    if (action === 'delete') {
      await bulkDelete({ variables: { userIds: selectedUsers } });
    } else if (action === 'activate') {
      await bulkUpdate({
        variables: {
          userIds: selectedUsers,
          input: { isActive: true },
        },
      });
    } else if (action === 'deactivate') {
      await bulkUpdate({
        variables: {
          userIds: selectedUsers,
          input: { isActive: false },
        },
      });
    } else if (action === 'change-role' && actionValue) {
      await bulkUpdate({
        variables: {
          userIds: selectedUsers,
          input: { role: actionValue },
        },
      });
    }
  };

  const getActionMessage = () => {
    const count = selectedUsers.length;
    if (action === 'delete') {
      return `Are you sure you want to delete ${count} ${count === 1 ? 'user' : 'users'}? This action cannot be undone.`;
    } else if (action === 'activate') {
      return `Activate ${count} ${count === 1 ? 'user' : 'users'}?`;
    } else if (action === 'deactivate') {
      return `Deactivate ${count} ${count === 1 ? 'user' : 'users'}?`;
    } else if (action === 'change-role') {
      return `Change role for ${count} ${count === 1 ? 'user' : 'users'} to ${actionValue}?`;
    }
    return '';
  };

  if (selectedUsers.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex items-center space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex-1">
          <p className="font-medium">
            {selectedUsers.length}{' '}
            {selectedUsers.length === 1 ? 'user' : 'users'} selected
          </p>
        </div>
        <Select value={action} onValueChange={handleActionChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="activate">Activate</SelectItem>
            <SelectItem value="deactivate">Deactivate</SelectItem>
            <SelectItem value="change-role">Change Role</SelectItem>
            <SelectItem value="delete">Delete</SelectItem>
          </SelectContent>
        </Select>
        {action === 'change-role' && (
          <Select value={actionValue} onValueChange={setActionValue}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CUSTOMER">Customer</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
            </SelectContent>
          </Select>
        )}
        {action && action !== 'delete' && (
          <Button
            onClick={handleApply}
            disabled={action === 'change-role' && !actionValue}
          >
            Apply
          </Button>
        )}
        <Button variant="outline" onClick={onClearSelection}>
          Clear Selection
        </Button>
      </div>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>{getActionMessage()}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
              disabled={updating || deleting}
            >
              Cancel
            </Button>
            <Button
              variant={action === 'delete' ? 'destructive' : 'default'}
              onClick={handleConfirm}
              disabled={updating || deleting}
            >
              {updating || deleting ? 'Processing...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
