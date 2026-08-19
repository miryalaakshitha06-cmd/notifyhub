import React from 'react';
import LoginForm from './LoginForm';

export default function AdminLogin() {
  return (
    <LoginForm
      roleTitle="Institution Admin"
      expectedRole="ADMIN"
      defaultEmail="admin@notifyhub.com"
      defaultPassword="admin123"
      badgeColor="var(--primary)"
    />
  );
}
