import React from 'react';
import { Paper, Typography, Alert } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const ComplianceDisclaimer: React.FC = () => {
    return (
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#fff3e0', border: '1px solid #ff9800' }}>
            <Alert severity="info" icon={<InfoIcon />}>
                <Typography variant="body2" fontWeight={600}>
                    Disclaimer
                </Typography>
                <Typography variant="body2">
                    IPO data shown is for informational purposes only. This is not investment advice, a recommendation, or a prediction of returns.
                    Please conduct your own research and consult with a qualified financial advisor before making any investment decisions.
                </Typography>
            </Alert>
        </Paper>
    );
};

export default ComplianceDisclaimer;
