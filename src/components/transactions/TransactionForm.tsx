import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Grid, FormControlLabel, Switch, Typography, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(2),
  amount: z.number().positive(),
  type: z.string().refine((val) => val === 'income' || val === 'expense', {
    message: 'Type must be either income or expense',
  }),
  category: z.string().min(1, "Category is required"),
  // account: z.string().min(1), // Removed account
  date: z.string(),
  notes: z.string().optional(),
  recurrenceEnabled: z.boolean().optional(),
  frequency: z
    .string()
    .refine((val) => !val || ['daily', 'weekly', 'monthly', 'yearly'].includes(val), {
      message: 'Frequency must be daily, weekly, monthly, or yearly',
    })
    .optional(),
});

export type TransactionFormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  initialValues?: Partial<TransactionFormValues>;
  onClose: () => void;
  onSubmit: (values: TransactionFormValues, attachments: FileList | null) => void;
}

const TransactionForm: React.FC<Props> = ({ open, initialValues, onClose, onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      amount: 0,
      type: 'expense',
      category: '',
      date: new Date().toISOString().slice(0, 10),
      recurrenceEnabled: false,
      frequency: '', // Add default value to prevent controlled/uncontrolled warning
      ...initialValues,
    },
  });

  const recurrenceEnabled = watch('recurrenceEnabled');
  const [attachments, setAttachments] = React.useState<FileList | null>(null);

  React.useEffect(() => {
    if (!open) {
      setAttachments(null);
    }
  }, [open]);

  const submit = (values: TransactionFormValues) => {
    onSubmit(values, attachments);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{initialValues ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
      <form onSubmit={handleSubmit(submit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Title" fullWidth error={!!errors.title} helperText={errors.title?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Amount"
                    fullWidth
                    error={!!errors.amount}
                    helperText={errors.amount?.message}
                    onChange={(event) => field.onChange(Number(event.target.value))}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Type" fullWidth>
                    <MenuItem value="income">Income</MenuItem>
                    <MenuItem value="expense">Expense</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Category"
                    fullWidth
                    error={!!errors.category}
                    helperText={errors.category?.message}
                    placeholder="e.g., Groceries, Rent, Salary"
                  />
                )}
              />
            </Grid>
            {/* <Grid item xs={12} md={6}>
              <Controller name="account" control={control} render={({ field }) => <AccountSelector value={field.value} onChange={field.onChange} />} />
            </Grid> */}
            <Grid item xs={12} md={6}>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    label="Date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.date}
                    helperText={errors.date?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Attachments"
                type="file"
                fullWidth
                inputProps={{ multiple: true }}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAttachments(event.target.files)}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => <TextField {...field} label="Notes" multiline rows={3} fullWidth />}
              />
            </Grid>
            <Grid item xs={12}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Controller
                    name="recurrenceEnabled"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch checked={Boolean(field.value)} onChange={(_, checked) => field.onChange(checked)} />}
                        label="Recurring transaction"
                      />
                    )}
                  />
                  <Tooltip title="Mark transactions that repeat regularly. This helps our AI provide more accurate financial insights and predictions.">
                    <InfoOutlinedIcon fontSize="small" color="action" sx={{ cursor: 'help' }} />
                  </Tooltip>
                </div>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, ml: 0.5 }}>
                  {watch('type') === 'income'
                    ? '💡 Examples: Monthly salary, freelance retainer, rental income'
                    : '💡 Examples: Rent, subscriptions (Netflix, Spotify), EMIs, utility bills'
                  }
                </Typography>
              </div>
            </Grid>
            {recurrenceEnabled && (
              <Grid item xs={12} md={6}>
                <Controller
                  name="frequency"
                  control={control}
                  rules={{ required: recurrenceEnabled }}
                  render={({ field }) => (
                    <TextField {...field} select label="Frequency" fullWidth helperText="How often does this transaction repeat?">
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                      <MenuItem value="yearly">Yearly</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TransactionForm;

