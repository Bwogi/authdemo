'use client';

import { Layout } from 'antd';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const { Content } = Layout;

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout className="min-h-screen">
      <Navbar />
      <Content className="flex-grow pt-16">
        {children}
      </Content>
      <Footer />
    </Layout>
  );
}
