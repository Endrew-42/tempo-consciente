import React from 'react';
import { useTime } from '@/contexts/TimeContext';
import { CircularProgress } from '@/components/CircularProgress';
import { StatCard } from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { Play, Pause, Clock, AlertTriangle, Timer, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Dashboard: React.FC = () => {
  const { state, settings, startSession, pauseSession } = useTime();

  const formatTime = (minutes: number): string => {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeMessage = (): string => {
    const percentage = (state.remainingMinutes / settings.sessionLimitMinutes) * 100;
    if (percentage > 70) return 'Aproveite seu tempo!';
    if (percentage > 40) return 'Já passou da metade...';
    if (percentage > 20) return 'Quase no limite!';
    return 'Hora de descansar!';
  };

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-lg mx-auto space-y-8">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <h1 className="text-2xl font-display font-bold mb-2">TempoEquilíbrio</h1>
          <p className="text-muted-foreground">Controle seu tempo de uso</p>
        </div>

        {/* Main Progress */}
        <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CircularProgress
            value={state.remainingMinutes}
            max={settings.sessionLimitMinutes}
            size={240}
            strokeWidth={16}
          >
            <div className="text-center">
              <p className="text-5xl font-display font-bold">
                {Math.floor(state.remainingMinutes)}
              </p>
              <p className="text-muted-foreground mt-1">minutos restantes</p>
              <p className="text-sm text-muted-foreground/70 mt-2">
                {getTimeMessage()}
              </p>
            </div>
          </CircularProgress>
        </div>

        {/* Control Button */}
        <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Button
            onClick={state.isActive ? pauseSession : startSession}
            size="lg"
            className={cn(
              'h-16 px-12 text-lg font-semibold rounded-full transition-all duration-300',
              state.isActive
                ? 'bg-secondary hover:bg-secondary/80'
                : 'gradient-primary hover:opacity-90 glow-primary'
            )}
          >
            {state.isActive ? (
              <>
                <Pause className="w-6 h-6 mr-2" />
                Pausar
              </>
            ) : (
              <>
                <Play className="w-6 h-6 mr-2" />
                Iniciar
              </>
            )}
          </Button>
        </div>

        {/* Status Indicator */}
        <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.25s' }}>
          <div
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm',
              state.isActive
                ? 'bg-primary/20 text-primary'
                : 'bg-muted text-muted-foreground'
            )}
          >
            <div
              className={cn(
                'w-2 h-2 rounded-full',
                state.isActive ? 'bg-primary animate-pulse' : 'bg-muted-foreground'
              )}
            />
            {state.isActive ? 'Monitorando uso' : 'Em pausa'}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4" style={{ animationDelay: '0.3s' }}>
          <StatCard
            icon={Clock}
            label="Uso hoje"
            value={`${state.todayUsage.totalUsageMinutes} min`}
            variant="default"
          />
          <StatCard
            icon={AlertTriangle}
            label="Limites atingidos"
            value={state.todayUsage.timesLimitReached}
            variant={state.todayUsage.timesLimitReached > 0 ? 'warning' : 'default'}
          />
          <StatCard
            icon={Timer}
            label="Emergências usadas"
            value={`${state.todayUsage.emergencyCount}/${settings.maxEmergenciesPerDay}`}
            variant={state.todayUsage.emergencyCount > 0 ? 'danger' : 'default'}
          />
          <StatCard
            icon={TrendingUp}
            label="Limite de sessão"
            value={`${settings.sessionLimitMinutes} min`}
            variant="primary"
          />
        </div>

        {/* Recovery Info */}
        {!state.isActive && state.remainingMinutes < settings.sessionLimitMinutes && (
          <div className="glass-card rounded-xl p-4 border border-primary/20 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Recuperando tempo...</p>
                <p className="text-xs text-muted-foreground mt-1">
                  A cada {settings.recoveryRatio} min de descanso, você recupera 1 min de uso.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
