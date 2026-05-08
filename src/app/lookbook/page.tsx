import { Metadata } from 'next';
import LookbookClient from './LookbookClient';

export const metadata: Metadata = {
  title: 'Lookbook - PROJECT INKED',
  description: 'Explore Drop 001. Garments as marks. Fabric as memory.',
};

export default function LookbookPage() {
  return <LookbookClient />;
}
