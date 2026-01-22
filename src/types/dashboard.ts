import type { ComponentType, SVGProps } from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
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