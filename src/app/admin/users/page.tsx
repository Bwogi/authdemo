'use client';

import { useEffect, useState } from 'react';
import { Table, Button, message, Space, Tag, Switch, Popconfirm, Alert } from 'antd';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  isAdmin: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionStatus === 'loading') return;
    
    if (!session?.user) {
      router.push('/admin/login');
      return;
    }
    
    fetchUsers();
  }, [session, sessionStatus, router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch('/api/admin/users', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch users');
      }

      const data = await res.json();
      if (!Array.isArray(data.users)) {
        throw new Error('Invalid response format');
      }

      setUsers(data.users);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(error.message || 'Failed to load users');
      message.error(error.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update user');
      }

      message.success(`User ${status} successfully`);
      fetchUsers();
    } catch (error: any) {
      console.error('Error updating user:', error);
      message.error(error.message || 'Failed to update user');
    }
  };

  const handleAdminToggle = async (userId: string, makeAdmin: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAdmin: makeAdmin }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update admin status');
      }

      message.success(`Admin rights ${makeAdmin ? 'granted' : 'revoked'} successfully`);
      fetchUsers();
    } catch (error: any) {
      console.error('Error updating admin status:', error);
      message.error(error.message || 'Failed to update admin status');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'approved' ? 'green' :
          status === 'rejected' ? 'red' :
          'orange'
        }>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Admin',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      render: (_: any, record: User) => (
        <Popconfirm
          title={`${record.isAdmin ? 'Revoke' : 'Grant'} admin rights`}
          description={`Are you sure you want to ${record.isAdmin ? 'revoke' : 'grant'} admin rights for ${record.name}?`}
          onConfirm={() => handleAdminToggle(record._id, !record.isAdmin)}
          okText="Yes"
          cancelText="No"
        >
          <Switch
            checked={record.isAdmin}
            checkedChildren="Admin"
            unCheckedChildren="User"
          />
        </Popconfirm>
      ),
    },
    {
      title: 'Registered',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space size="small">
          {record.status === 'pending' && (
            <>
              <Button
                type="primary"
                onClick={() => handleStatusChange(record._id, 'approved')}
              >
                Approve
              </Button>
              <Button
                danger
                onClick={() => handleStatusChange(record._id, 'rejected')}
              >
                Reject
              </Button>
            </>
          )}
          {record.status === 'rejected' && (
            <Button
              type="primary"
              onClick={() => handleStatusChange(record._id, 'approved')}
            >
              Approve
            </Button>
          )}
          {record.status === 'approved' && (
            <Button
              danger
              onClick={() => handleStatusChange(record._id, 'rejected')}
            >
              Reject
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Show loading state while checking session
  if (sessionStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="p-6">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <Button onClick={fetchUsers}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="_id"
      />
    </div>
  );
}
