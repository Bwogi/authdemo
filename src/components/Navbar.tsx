'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Layout, Button, Avatar, Space, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined, DashboardOutlined, LockOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { motion, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';

const { Header } = Layout;
const MotionHeader = motion(Header);

export default function Navbar() {
  const { data: session } = useSession();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  // Update isScrolled state based on scroll position
  useEffect(() => {
    const updateScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', updateScroll);
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

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
      className={`fixed w-full z-50 transition-all duration-300
        ${isScrolled 
          ? 'bg-white/90 shadow-md backdrop-blur-sm' 
          : 'bg-gradient-to-b from-black/50 to-transparent backdrop-blur-[2px]'
        }
      `}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center h-full px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/" className="flex items-center space-x-2 group">
            <LockOutlined className={`text-2xl transition-colors duration-300 ${
              isScrolled ? 'text-blue-500' : 'text-blue-400'
            } group-hover:scale-110 transition-transform duration-300`} />
            <span className={`text-xl font-bold transition-colors duration-300 ${
              isScrolled ? 'text-gray-800' : 'text-white'
            }`}>
              Auth Demo
            </span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {session ? (
            <Space size="middle">
              <span className={`transition-colors duration-300 ${
                isScrolled ? 'text-gray-600' : 'text-white'
              }`}>
                {session.user?.name}
              </span>
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Avatar 
                  icon={<UserOutlined />} 
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                    isScrolled 
                      ? 'bg-blue-500 hover:bg-blue-600' 
                      : 'bg-blue-400 hover:bg-blue-500'
                  }`}
                />
              </Dropdown>
            </Space>
          ) : (
            <Link href="/login">
              <Button 
                type="primary"
                icon={<UserOutlined />}
                className={`border-none transition-all duration-300 hover:scale-105 ${
                  isScrolled 
                    ? 'bg-blue-500 hover:bg-blue-600' 
                    : 'bg-blue-400 hover:bg-blue-500'
                }`}
              >
                <span className="text-white">
                  Sign In
                </span>
              </Button>
            </Link>
          )}
        </motion.div>
      </div>
    </MotionHeader>
  );
}
