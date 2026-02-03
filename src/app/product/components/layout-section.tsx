import { twx } from "@/lib/twx";

const SectionContainer = twx.div`
  space-y-8
`;

const GridContainer = twx.div`
  grid gap-8 md:grid-cols-3 transition-all duration-300
`;

const MainColumn = twx.div`
  md:col-span-2
`;

const SideColumn = twx.div``;

const Divider = twx.hr`
  border-t border-border
`;

interface SectionContainerProps {
  children: React.ReactNode;
}

interface GridContainerProps {
  children: React.ReactNode;
}

interface ColumnProps {
  children: React.ReactNode;
}

export function ProductSection({ children }: SectionContainerProps) {
  return <SectionContainer>{children}</SectionContainer>;
}

export function ProductGrid({ children }: GridContainerProps) {
  return <GridContainer>{children}</GridContainer>;
}

export function MainGridColumn({ children }: ColumnProps) {
  return <MainColumn>{children}</MainColumn>;
}

export function SideGridColumn({ children }: ColumnProps) {
  return <SideColumn>{children}</SideColumn>;
}

export function ProductDivider() {
  return <Divider />;
}
