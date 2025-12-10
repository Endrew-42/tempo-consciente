import React from 'react';
import { useTime } from '@/contexts/TimeContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  SESSION_LIMIT_OPTIONS, 
  RECOVERY_RATIO_OPTIONS, 
  EMERGENCY_DURATION_OPTIONS 
} from '@/models/types';
import { Settings as SettingsIcon, RotateCcw, Clock, Battery, Timer, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export const Settings: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useTime();

  const handleSessionLimitChange = (value: number[]) => {
    updateSettings({ ...settings, sessionLimitMinutes: value[0] });
  };

  const handleRecoveryRatioChange = (value: string) => {
    updateSettings({ ...settings, recoveryRatio: parseInt(value) });
  };

  const handleEmergencyDurationChange = (value: string) => {
    updateSettings({ ...settings, emergencyDurationMinutes: parseInt(value) });
  };

  const handleMaxEmergenciesChange = (value: number[]) => {
    updateSettings({ ...settings, maxEmergenciesPerDay: value[0] });
  };

  const handleReset = () => {
    resetSettings();
    toast.success('Configurações restauradas!');
  };

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-lg mx-auto space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg gradient-primary">
              <SettingsIcon className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-display font-bold">Configurações</h1>
          </div>
          <p className="text-muted-foreground">
            Personalize seu controle de tempo
          </p>
        </div>

        {/* Session Limit */}
        <div className="glass-card rounded-xl p-6 border animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <h2 className="font-display font-semibold">Limite de Sessão</h2>
              <p className="text-sm text-muted-foreground">Tempo máximo de uso contínuo</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">15 min</span>
              <span className="text-2xl font-display font-bold text-primary">
                {settings.sessionLimitMinutes} min
              </span>
              <span className="text-sm text-muted-foreground">60 min</span>
            </div>
            <Slider
              value={[settings.sessionLimitMinutes]}
              onValueChange={handleSessionLimitChange}
              min={15}
              max={60}
              step={5}
              className="w-full"
            />
            <div className="flex justify-center gap-2">
              {SESSION_LIMIT_OPTIONS.map((option) => (
                <Button
                  key={option}
                  variant={settings.sessionLimitMinutes === option ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSessionLimitChange([option])}
                  className="min-w-[50px]"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Recovery Ratio */}
        <div className="glass-card rounded-xl p-6 border animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-4">
            <Battery className="w-5 h-5 text-primary" />
            <div>
              <h2 className="font-display font-semibold">Velocidade de Recuperação</h2>
              <p className="text-sm text-muted-foreground">Quanto tempo de descanso para recuperar 1 minuto</p>
            </div>
          </div>
          
          <Select
            value={settings.recoveryRatio.toString()}
            onValueChange={handleRecoveryRatioChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RECOVERY_RATIO_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Emergency Settings */}
        <div className="glass-card rounded-xl p-6 border animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-accent" />
            <div>
              <h2 className="font-display font-semibold">Configurações de Emergência</h2>
              <p className="text-sm text-muted-foreground">Ajuste o tempo extra e limites</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Emergency Duration */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Tempo extra por emergência
              </label>
              <Select
                value={settings.emergencyDurationMinutes.toString()}
                onValueChange={handleEmergencyDurationChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EMERGENCY_DURATION_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option} minutos
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Max Emergencies */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Máximo de emergências por dia
              </label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[settings.maxEmergenciesPerDay]}
                  onValueChange={handleMaxEmergenciesChange}
                  min={1}
                  max={5}
                  step={1}
                  className="flex-1"
                />
                <span className="text-lg font-display font-bold min-w-[40px] text-center">
                  {settings.maxEmergenciesPerDay}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
            className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Restaurar Padrões
          </Button>
        </div>
      </div>
    </div>
  );
};
