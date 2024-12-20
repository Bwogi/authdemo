'use client';

import { Layout, Row, Col, Typography, Space } from 'antd';
import { GithubOutlined, TwitterOutlined, LinkedinOutlined, LockOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import Link from 'next/link';

const { Title, Text } = Typography;
const { Footer: AntFooter } = Layout;

const MotionFooter = motion(AntFooter);

export default function Footer() {
  return (
    <MotionFooter
      className="bg-gradient-to-b from-gray-900 to-black"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto flex justify-enter items-center">
        <Row gutter={[48, 32]} justify="space-between">
          <Col xs={24} sm={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Title level={4} className="text-blue-400">
                About
              </Title>
              <Text className="text-gray-400">
                Secure authentication solution built with Next.js and MongoDB.
              </Text>
            </motion.div>
          </Col>
          <Col xs={24} sm={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Title level={4} className="text-blue-400">
                Quick Links
              </Title>
              <Space direction="vertical" className="w-full">
                <Link href="/" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Home
                </Link>
                <Link href="/dashboard" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Dashboard
                </Link>
                <Link href="/admin/register" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Admin Registration
                </Link>
              </Space>
            </motion.div>
          </Col>
          <Col xs={24} sm={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Title level={4} className="text-blue-400">
                Connect
              </Title>
              <Space className="text-gray-400">
                <GithubOutlined className="text-xl hover:text-blue-400 cursor-pointer" />
                <TwitterOutlined className="text-xl hover:text-blue-400 cursor-pointer" />
                <LinkedinOutlined className="text-xl hover:text-blue-400 cursor-pointer" />
              </Space>
            </motion.div>
          </Col>
        </Row>
      </div>
    </MotionFooter>
  );
}
