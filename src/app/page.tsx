'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Typography, Button, Row, Col, Card, Space, Divider } from 'antd';
import { SecurityScanOutlined, ThunderboltOutlined, DatabaseOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Paragraph } = Typography;

const MotionCard = motion(Card);
const MotionTitle = motion(Title);
const MotionParagraph = motion(Paragraph);

export default function Home() {
  const { data: session } = useSession();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-20" />
        </div>
        <Row className="min-h-[600px] relative z-10" align="middle" justify="center">
          <Col xs={24} className="px-4 py-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <MotionTitle className="text-white mb-6" level={1}>
                Welcome to Auth Demo
              </MotionTitle>
              <MotionParagraph className="text-lg mb-8 text-gray-100">
                A secure and modern authentication system built with Next.js 14 and MongoDB
              </MotionParagraph>
              
              {!session ? (
                <Button type="primary" size="large" className="bg-white text-blue-600 hover:bg-gray-100 border-none">
                  <Link href="/login">Get Started</Link>
                </Button>
              ) : (
                <Space direction="vertical" align="center">
                  <Title level={3} className="text-white mb-6">
                    Welcome back, {session.user?.name}!
                  </Title>
                  <Button type="primary" size="large" className="bg-white text-blue-600 hover:bg-gray-100 border-none">
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                </Space>
              )}
            </motion.div>
          </Col>
        </Row>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <Row className="max-w-7xl mx-auto px-4" gutter={[24, 24]} justify="center">
          <Col span={24} className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Title level={2}>
                Powerful Features
              </Title>
              <Paragraph className="text-gray-600 text-lg">
                Everything you need for a modern authentication system
              </Paragraph>
            </motion.div>
          </Col>

          <motion.div
            className="w-full"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <Row gutter={[32, 32]}>
              <Col xs={24} md={8}>
                <MotionCard
                  variants={item}
                  className="h-full hover:shadow-lg transition-shadow duration-300"
                  bordered={false}
                >
                  <SecurityScanOutlined className="text-5xl text-blue-500 mb-6" />
                  <Title level={4}>Secure Authentication</Title>
                  <Paragraph className="text-gray-600">
                    Industry-standard security practices with password hashing and secure sessions
                  </Paragraph>
                </MotionCard>
              </Col>

              <Col xs={24} md={8}>
                <MotionCard
                  variants={item}
                  className="h-full hover:shadow-lg transition-shadow duration-300"
                  bordered={false}
                >
                  <ThunderboltOutlined className="text-5xl text-blue-500 mb-6" />
                  <Title level={4}>Lightning Fast</Title>
                  <Paragraph className="text-gray-600">
                    Built with Next.js 14 for optimal performance and user experience
                  </Paragraph>
                </MotionCard>
              </Col>

              <Col xs={24} md={8}>
                <MotionCard
                  variants={item}
                  className="h-full hover:shadow-lg transition-shadow duration-300"
                  bordered={false}
                >
                  <DatabaseOutlined className="text-5xl text-blue-500 mb-6" />
                  <Title level={4}>MongoDB Integration</Title>
                  <Paragraph className="text-gray-600">
                    Reliable data storage with MongoDB Atlas cloud database
                  </Paragraph>
                </MotionCard>
              </Col>
            </Row>
          </motion.div>
        </Row>
      </div>
    </div>
  );
}
