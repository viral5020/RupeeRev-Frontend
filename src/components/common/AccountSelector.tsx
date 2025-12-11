import React from 'react';
import { MenuItem, TextField } from '@mui/material';
import { useAccounts } from '../../hooks/useAccounts';

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

const AccountSelector: React.FC<Props> = ({ value, onChange }) => {
  const { data } = useAccounts();
  return (
    <TextField select label="Account" value={value ?? ''} onChange={(event) => onChange(event.target.value)} fullWidth>
      {data?.map((account) => (
        <MenuItem key={account._id} value={account._id}>
          {account.name} ({account.currency})
        </MenuItem>
      )) || <MenuItem disabled>No accounts</MenuItem>}
    </TextField>
  );
};

export default AccountSelector;

