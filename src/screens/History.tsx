import React from 'react';
import { storageService } from '@/services/storageService';
import { useTime } from '@/contexts/TimeContext';
import { DailyUsage } from '@/models/types';
import { Calendar, Clock, AlertTriangle, Timer, TrendingUp } from 'lucide-react';
import { format, parseISO, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const HistoryCard: React.FC<{ usage: DailyUsage; isCurrentDay?: boolean }> = ({ 
  usage, 
  isCurrentDay 
}) => {
  const date = parseISO(usage.date);
  
  const getDateLabel = () => {
    if (isToday(date)) return 'Hoje';
    if (isYesterday(date)) return 'Ontem';
    return format(date, "dd 'de' MMMM", { locale: ptBR });
  };

  return (
    <div className={`glass-card rounded-xl p-5 border animate-fade-in ${
      isCurrentDay ? 'border-primary/30 bg-primary/5' : ''
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="font-display font-semibold">{getDateLabel()}</span>
        </div>
        {isCurrentDay && (
          <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
            Atual
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Tempo de uso</p>
            <p className="font-semibold">{usage.totalUsageMinutes} min</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" />
          <div>
            <p className="text-xs text-muted-foreground">Limites atingidos</p>
            <p className="font-semibold">{usage.timesLimitReached}x</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-destructive" />
          <div>
            <p className="text-xs text-muted-foreground">Emergências</p>
            <p className="font-semibold">{usage.emergencyCount}x</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Min. emergência</p>
            <p className="font-semibold">{usage.emergencyMinutesUsed} min</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const History: React.FC = () => {
  const { state } = useTime();
  const history = storageService.getLastNDaysUsage(14);
  
  // Combine today's data with history
  const allDays: DailyUsage[] = [state.todayUsage, ...history.filter(h => h.date !== state.todayUsage.date)];

  // Calculate weekly averages
  const last7Days = allDays.slice(0, 7);
  const avgUsage = last7Days.length > 0 
    ? Math.round(last7Days.reduce((acc, d) => acc + d.totalUsageMinutes, 0) / last7Days.length)
    : 0;
  const totalEmergencies = last7Days.reduce((acc, d) => acc + d.emergencyCount, 0);

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg gradient-primary">
              <Calendar className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-display font-bold">Histórico</h1>
          </div>
          <p className="text-muted-foreground">
            Acompanhe seu progresso
          </p>
        </div>

        {/* Weekly Summary */}
        <div className="glass-card rounded-xl p-5 border border-primary/20 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="font-display font-semibold mb-4">Últimos 7 dias</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-secondary rounded-lg">
              <p className="text-3xl font-display font-bold text-primary">{avgUsage}</p>
              <p className="text-sm text-muted-foreground">min/dia (média)</p>
            </div>
            <div className="text-center p-4 bg-secondary rounded-lg">
              <p className="text-3xl font-display font-bold text-accent">{totalEmergencies}</p>
              <p className="text-sm text-muted-foreground">emergências</p>
            </div>
          </div>
        </div>

        {/* Daily History */}
        <div className="space-y-4">
          {allDays.length > 0 ? (
            allDays.map((usage, index) => (
              <HistoryCard 
                key={usage.date} 
                usage={usage} 
                isCurrentDay={index === 0}
              />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum histórico disponível ainda.</p>
              <p className="text-sm">Comece a usar o app para ver suas estatísticas!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
