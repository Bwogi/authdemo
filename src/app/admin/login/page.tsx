'use client';

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Form, Input, Button, Typography, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

const { Title } = Typography;

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const callbackUrl = searchParams?.get('callbackUrl') || '/admin/users';

  // Redirect if already logged in as admin
  useEffect(() => {
    if (session?.user?.isAdmin) {
      router.push(callbackUrl);
    }
  }, [session, router, callbackUrl]);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      const updatedSession = await fetch('/api/auth/session');
      const sessionData = await updatedSession.json();

      if (!sessionData?.user?.isAdmin) {
        throw new Error('Not authorized as admin');
      }

      router.push(callbackUrl);
    } catch (error: any) {
      message.error(error.message || 'Failed to login');
      setLoading(false);
    }
  };

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  // If already logged in as admin, don't show the form
  if (session?.user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div className="text-center">
          <LockOutlined className="text-4xl text-blue-500" />
          <Title level={2} className="mt-6">
            Admin Login
          </Title>
          <p className="mt-2 text-gray-600">
            Please sign in with your administrator account
          </p>
        </div>

        <Form
          name="admin-login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input size="large" placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password size="large" placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
              size="large"
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
