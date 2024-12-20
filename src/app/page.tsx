'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Typography, Button, Row, Col, Card, Space, Divider } from 'antd';
import { SecurityScanOutlined, ThunderboltOutlined, DatabaseOutlined, ArrowRightOutlined } from '@ant-design/icons';
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
      <div className="relative min-h-screen">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
          {/* Animated background patterns */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2)_0%,transparent_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)]" />
            {/* Animated dots */}
            <div className="absolute inset-0 opacity-30">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  initial={{
                    x: Math.random() * 100 + '%',
                    y: Math.random() * 100 + '%',
                    scale: Math.random() * 0.5 + 0.5,
                    opacity: Math.random() * 0.5 + 0.25
                  }}
                  animate={{
                    y: [null, '-20px'],
                    opacity: [null, 0]
                  }}
                  transition={{
                    duration: Math.random() * 2 + 2,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 pt-32">
          <Row className="min-h-[calc(100vh-128px)]" align="middle" justify="center">
            <Col xs={24} className="px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl mx-auto"
              >
                <MotionTitle 
                  className="!text-white !text-6xl md:!text-7xl !font-bold !mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                    Welcome to Auth Demo
                  </span>
                </MotionTitle>
                
                <MotionParagraph 
                  className="text-xl md:text-2xl mb-12 text-white/90"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  A secure and modern authentication system built with{' '}
                  <span className="text-blue-200">Next.js 14</span> and{' '}
                  <span className="text-blue-200">MongoDB</span>
                </MotionParagraph>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  {!session ? (
                    <Space size="middle">
                      <Button 
                        type="primary" 
                        size="large"
                        icon={<ArrowRightOutlined />}
                        className="bg-white hover:bg-gray-100 text-blue-600 border-none h-14 px-8 text-lg hover:scale-105 transition-all duration-300"
                      >
                        <Link href="/login">Sign In</Link>
                      </Button>
                      <Button 
                        type="default" 
                        size="large"
                        className="bg-blue-500 hover:bg-blue-600 text-white border-none h-14 px-8 text-lg hover:scale-105 transition-all duration-300"
                      >
                        <Link href="/register">Register</Link>
                      </Button>
                    </Space>
                  ) : (
                    <Space direction="vertical" align="center" size="large">
                      <Title level={3} className="!text-white !m-0">
                        Welcome back, {session.user?.name}!
                      </Title>
                      <Button 
                        type="primary" 
                        size="large"
                        icon={<ArrowRightOutlined />}
                        className="bg-white hover:bg-gray-100 text-blue-600 border-none h-14 px-8 text-lg hover:scale-105 transition-all duration-300"
                      >
                        <Link href="/dashboard">Go to Dashboard</Link>
                      </Button>
                    </Space>
                  )}
                </motion.div>
              </motion.div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Features Section */}
      <div className="flex align-center justify-center py-20 bg-white mx-auto">
        <Row className="max-w-7xl mx-auto px-4" gutter={[24, 24]} justify="center">
          <Col span={24} className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Title level={2} className="!text-4xl !font-bold mb-6">
                Powerful Features
              </Title>
              <Paragraph className="text-gray-600 text-lg max-w-2xl mx-auto">
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
            <Row gutter={[48, 48]}>
              <Col xs={24} md={8}>
                <MotionCard
                  variants={item}
                  className="h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-center"
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
                  className="h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-center"
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
                  className="h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-center"
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
