import { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
  trend?: string;
}

export interface RecentDoctor {
  id: string;
  name: string;
  crm: string;
  specialty: string;
  email: string;
}