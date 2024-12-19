'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Layout, Menu, Button, Avatar, Space, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined, DashboardOutlined, LockOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { motion } from 'framer-motion';

const { Header } = Layout;

const MotionHeader = motion(Header);

export default function Navbar() {
  const { data: session } = useSession();

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      label: <Link href="/dashboard">Dashboard</Link>,
      icon: <DashboardOutlined />,
    },
    {
      key: 'signout',
      label: 'Sign Out',
      icon: <LogoutOutlined />,
      onClick: () => signOut(),
      danger: true,
    },
  ];

  return (
    <MotionHeader 
      className="bg-white px-4 border-b border-gray-200 fixed w-full z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center h-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/" className="flex items-center space-x-2">
            <LockOutlined className="text-2xl text-blue-600" />
            <span className="text-xl font-bold text-gray-800">Auth Demo</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {session ? (
            <Space size="middle">
              <span className="text-gray-600">
                {session.user?.name}
              </span>
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Avatar 
                  icon={<UserOutlined />} 
                  className="cursor-pointer bg-blue-500 hover:bg-blue-600 transition-colors"
                />
              </Dropdown>
            </Space>
          ) : (
            <Link href="/login">
              <Button 
                type="primary"
                icon={<UserOutlined />}
                className="bg-blue-500 hover:bg-blue-600 border-none"
              >
                Sign In
              </Button>
            </Link>
          )}
        </motion.div>
      </div>
    </MotionHeader>
  );
}
