import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact - PROJECT INKED',
  description: 'Get in touch with PROJECT INKED for support, wholesale, or collaborations.',
};

export default function ContactPage() {
  return <ContactClient />;
}
