import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProfileView } from '@/components/account/profile-view';

export const metadata: Metadata = {
  title: 'Collector Account & Saved Details | Level X 3D',
  description: 'Manage your Level X 3D profile, default delivery address, and bespoke 3D print commissions.',
};

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between selection:bg-onyx selection:text-chalk">
      <Header theme="light" />

      <main className="flex-1">
        <ProfileView />
      </main>

      <Footer />
    </div>
  );
}
