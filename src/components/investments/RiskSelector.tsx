import React from 'react';
import { Box, Typography, Slider, Paper, Switch, FormControlLabel } from '@mui/material';

interface RiskSelectorProps {
    riskLevel: 'low' | 'medium' | 'high';
    isAuto: boolean;
    onChange: (risk: 'low' | 'medium' | 'high', isAuto: boolean) => void;
    showAutoToggle?: boolean;
}

const RiskSelector: React.FC<RiskSelectorProps> = ({ riskLevel, isAuto, onChange, showAutoToggle = true }) => {
    const riskValues = { low: 0, medium: 1, high: 2 };
    const riskLabels = ['low', 'medium', 'high'] as const;

    const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
        switch (risk) {
            case 'low': return '#10b981';
            case 'medium': return '#f59e0b';
            case 'high': return '#ef4444';
        }
    };

    const getRiskEmoji = (risk: 'low' | 'medium' | 'high') => {
        switch (risk) {
            case 'low': return '🛡️';
            case 'medium': return '⚖️';
            case 'high': return '🚀';
        }
    };

    const getRiskDescription = (risk: 'low' | 'medium' | 'high') => {
        switch (risk) {
            case 'low': return 'Conservative - Focus on capital preservation';
            case 'medium': return 'Balanced - Mix of safety and growth';
            case 'high': return 'Aggressive - Maximum growth potential';
        }
    };

    const handleSliderChange = (_event: Event, value: number | number[]) => {
        const newRisk = riskLabels[value as number];
        onChange(newRisk, isAuto);
    };

    const handleAutoToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(riskLevel, event.target.checked);
    };

    return (
        <Paper sx={{
            p: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #fef3c7 100%)',
            border: '2px solid #fde68a',
            borderRadius: 3,
        }}>
            <Typography variant="h6" sx={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
                mb: 2,
            }}>
                🎯 Risk Tolerance Level
            </Typography>

            {showAutoToggle && (
                <FormControlLabel
                    control={
                        <Switch
                            checked={isAuto}
                            onChange={handleAutoToggle}
                            color="primary"
                        />
                    }
                    label={
                        <Typography variant="body2" color="text.secondary">
                            {isAuto ? '🤖 Auto-detected based on spending habits' : '✋ Manual selection'}
                        </Typography>
                    }
                    sx={{ mb: 2 }}
                />
            )}

            <Box sx={{ px: 2 }}>
                <Slider
                    value={riskValues[riskLevel]}
                    onChange={handleSliderChange}
                    min={0}
                    max={2}
                    step={1}
                    marks={[
                        { value: 0, label: '🛡️ Low' },
                        { value: 1, label: '⚖️ Medium' },
                        { value: 2, label: '🚀 High' },
                    ]}
                    disabled={isAuto}
                    sx={{
                        '& .MuiSlider-thumb': {
                            width: 24,
                            height: 24,
                            backgroundColor: getRiskColor(riskLevel),
                            border: '3px solid white',
                            boxShadow: `0 0 12px ${getRiskColor(riskLevel)}80`,
                        },
                        '& .MuiSlider-track': {
                            background: `linear-gradient(90deg, #10b981 0%, #f59e0b 50%, #ef4444 100%)`,
                            border: 'none',
                            height: 8,
                        },
                        '& .MuiSlider-rail': {
                            background: '#e5e7eb',
                            height: 8,
                        },
                        '& .MuiSlider-mark': {
                            display: 'none',
                        },
                        '& .MuiSlider-markLabel': {
                            fontSize: '0.875rem',
                            fontWeight: 600,
                        },
                    }}
                />
            </Box>

            <Box sx={{
                mt: 3,
                p: 2,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${getRiskColor(riskLevel)}20 0%, ${getRiskColor(riskLevel)}10 100%)`,
                border: `2px solid ${getRiskColor(riskLevel)}40`,
            }}>
                <Typography variant="h6" sx={{
                    color: getRiskColor(riskLevel),
                    fontWeight: 700,
                    mb: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}>
                    {getRiskEmoji(riskLevel)} {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {getRiskDescription(riskLevel)}
                </Typography>
            </Box>
        </Paper>
    );
};

export default RiskSelector;
