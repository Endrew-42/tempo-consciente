import React, { useState, useEffect, useCallback } from 'react';
import { useTime } from '@/contexts/TimeContext';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Moon, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

export const BlockScreen: React.FC = () => {
  const { isBlocked, dismissBlock, useEmergency, emergenciesRemaining, settings } = useTime();
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdDuration = 3000; // 3 seconds to hold

  useEffect(() => {
    if (showEmergencyConfirm && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, showEmergencyConfirm]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHolding) {
      const startTime = Date.now();
      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, (elapsed / holdDuration) * 100);
        setHoldProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          handleConfirmEmergency();
        }
      }, 50);
    } else {
      setHoldProgress(0);
    }
    return () => clearInterval(interval);
  }, [isHolding]);

  const handleEmergencyClick = () => {
    if (emergenciesRemaining <= 0) return;
    setShowEmergencyConfirm(true);
    setCountdown(5);
  };

  const handleConfirmEmergency = useCallback(() => {
    const success = useEmergency();
    if (success) {
      setShowEmergencyConfirm(false);
    }
  }, [useEmergency]);

  if (!isBlocked) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-destructive/20 to-transparent rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-accent/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="relative z-10 max-w-md w-full text-center space-y-8">
        <div className="animate-fade-in">
          <div className="w-24 h-24 mx-auto rounded-full gradient-danger flex items-center justify-center mb-6 animate-pulse-ring">
            <AlertTriangle className="w-12 h-12 text-destructive-foreground" />
          </div>
          
          <h1 className="text-3xl font-display font-bold mb-4">
            Limite Atingido!
          </h1>
          
          <p className="text-muted-foreground text-lg leading-relaxed">
            Você usou seus {settings.sessionLimitMinutes} minutos de uso contínuo.
            Hora de descansar e recarregar.
          </p>
        </div>

        {!showEmergencyConfirm ? (
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Button
              onClick={dismissBlock}
              size="lg"
              className="w-full h-14 text-lg font-medium gradient-primary hover:opacity-90 transition-opacity"
            >
              <Moon className="w-5 h-5 mr-2" />
              Fechar e Descansar
            </Button>
            
            <Button
              onClick={handleEmergencyClick}
              variant="outline"
              size="lg"
              className="w-full h-14 text-lg font-medium border-accent/50 hover:bg-accent/10"
              disabled={emergenciesRemaining <= 0}
            >
              <Timer className="w-5 h-5 mr-2" />
              Usar em Emergência
              {emergenciesRemaining > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  ({emergenciesRemaining} restantes)
                </span>
              )}
            </Button>
            
            {emergenciesRemaining <= 0 && (
              <p className="text-sm text-destructive">
                Você já usou todas as emergências de hoje.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-scale-in">
            <div className="glass-card rounded-xl p-6 border border-accent/30">
              <h2 className="text-xl font-display font-semibold mb-3 text-accent">
                Tem certeza?
              </h2>
              <p className="text-muted-foreground mb-4">
                Este tempo extra deve ser usado apenas em situações realmente necessárias.
                Você terá <span className="text-accent font-semibold">{settings.emergencyDurationMinutes} minutos</span> extras.
              </p>
              
              {countdown > 0 ? (
                <div className="text-4xl font-display font-bold text-accent mb-4">
                  {countdown}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Segure o botão por 3 segundos para confirmar
                  </p>
                  <div className="relative">
                    <Button
                      onMouseDown={() => setIsHolding(true)}
                      onMouseUp={() => setIsHolding(false)}
                      onMouseLeave={() => setIsHolding(false)}
                      onTouchStart={() => setIsHolding(true)}
                      onTouchEnd={() => setIsHolding(false)}
                      size="lg"
                      className={cn(
                        'w-full h-14 text-lg font-medium relative overflow-hidden',
                        'gradient-warning hover:opacity-90 transition-opacity'
                      )}
                    >
                      <div
                        className="absolute inset-0 bg-foreground/20"
                        style={{ width: `${holdProgress}%`, transition: 'width 50ms linear' }}
                      />
                      <span className="relative z-10">
                        {isHolding ? 'Segurando...' : 'Segurar para Confirmar'}
                      </span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <Button
              onClick={() => setShowEmergencyConfirm(false)}
              variant="ghost"
              size="lg"
              className="w-full"
            >
              Cancelar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
