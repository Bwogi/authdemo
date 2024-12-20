'use client';

import { useEffect, useState } from 'react';
import { Table, Button, message, Space, Tag, Switch, Popconfirm } from 'antd';
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
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      fetchUsers();
    }
  }, [session]);

  const fetchUsers = async () => {
    try {
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
      setUsers(data.users || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      message.error(error.message);
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
      fetchUsers(); // Refresh the list
    } catch (error: any) {
      console.error('Error updating user:', error);
      message.error(error.message);
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
      fetchUsers(); // Refresh the list
    } catch (error: any) {
      console.error('Error updating admin status:', error);
      message.error(error.message);
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

  if (!session?.user || !(session.user as any).isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">User Management</h1>
            <Button onClick={fetchUsers} type="default">
              Refresh List
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={users}
            rowKey="_id"
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
