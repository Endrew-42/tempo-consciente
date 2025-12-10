import React from 'react';
import { NavLink } from '@/components/NavLink';
import { Home, Settings, History } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Início' },
  { to: '/historico', icon: History, label: 'Histórico' },
  { to: '/configuracoes', icon: Settings, label: 'Ajustes' },
];

export const Navigation: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-xl border-t border-border">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
              activeClassName="text-primary"
            >
              {({ isActive }: { isActive: boolean }) => (
                <>
                  <div
                    className={cn(
                      'p-2 rounded-xl transition-all duration-300',
                      isActive ? 'bg-primary/20' : 'bg-transparent'
                    )}
                  >
                    <item.icon className={cn('w-5 h-5', isActive && 'text-primary')} />
                  </div>
                  <span className="text-xs font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};
