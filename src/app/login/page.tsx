"use client";

import dynamic from 'next/dynamic';

const LoginUI = dynamic(() => import('./LoginUI'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-neo-bg">
      <div className="animate-pulse font-mono text-neo-primary uppercase tracking-widest text-xs">
        Loading Auth System...
      </div>
    </div>
  )
});

export default function LoginPage() {
  return <LoginUI />;
}
