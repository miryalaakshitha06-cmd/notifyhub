import React from 'react';
import LoginForm from './LoginForm';

export default function HodLogin() {
  return (
    <LoginForm
      roleTitle="Head of Department (HOD)"
      expectedRole="HOD"
      defaultEmail="hod@notifyhub.com"
      defaultPassword="hod123"
      badgeColor="var(--secondary)"
    />
  );
}
