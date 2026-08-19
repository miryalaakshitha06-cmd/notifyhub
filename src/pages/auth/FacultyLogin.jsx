import React from 'react';
import LoginForm from './LoginForm';

export default function FacultyLogin() {
  return (
    <LoginForm
      roleTitle="Faculty & Instructor"
      expectedRole="FACULTY"
      defaultEmail="faculty@notifyhub.com"
      defaultPassword="faculty123"
      badgeColor="var(--success)"
    />
  );
}
