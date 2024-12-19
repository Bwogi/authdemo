'use client';

import { Layout, Row, Col, Typography, Space } from 'antd';
import { GithubOutlined, TwitterOutlined, LinkedinOutlined, LockOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

const MotionFooter = motion(AntFooter);

const socialLinks = [
  { icon: <GithubOutlined />, href: 'https://github.com' },
  { icon: <TwitterOutlined />, href: 'https://twitter.com' },
  { icon: <LinkedinOutlined />, href: 'https://linkedin.com' },
];

export default function Footer() {
  return (
    <MotionFooter 
      className="bg-gray-900 text-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto">
        <Row gutter={[48, 32]} justify="space-between">
          <Col xs={24} sm={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Space align="center" className="mb-6">
                <LockOutlined className="text-2xl text-blue-400" />
                <Title level={4} className="!text-blue-400 !m-0">
                  Auth Demo
                </Title>
              </Space>
              <Text className="text-gray-400 block">
                A modern authentication system built with Next.js 14 and MongoDB.
                Secure, fast, and reliable.
              </Text>
            </motion.div>
          </Col>
          
          <Col xs={24} sm={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Title level={4} className="!text-blue-400 mb-6">
                Quick Links
              </Title>
              <Space direction="vertical" size="middle">
                <Link href="/" className="text-gray-400 hover:text-blue-400">
                  Home
                </Link>
                <Link href="/login" className="text-gray-400 hover:text-blue-400">
                  Sign In
                </Link>
                <Link href="/dashboard" className="text-gray-400 hover:text-blue-400">
                  Dashboard
                </Link>
              </Space>
            </motion.div>
          </Col>
          
          <Col xs={24} sm={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Title level={4} className="!text-blue-400 mb-6">
                Connect With Us
              </Title>
              <Space size="large" className="text-2xl">
                {socialLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    target="_blank"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {link.icon}
                  </Link>
                ))}
              </Space>
            </motion.div>
          </Col>
        </Row>
        
        <Row justify="center" className="mt-12 pt-8 border-t border-gray-800">
          <Col>
            <Text className="text-gray-500">
              {new Date().getFullYear()} Auth Demo. All rights reserved.
            </Text>
          </Col>
        </Row>
      </div>
    </MotionFooter>
  );
}
