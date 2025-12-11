import React from 'react';
import { Box, Typography } from '@mui/material';
import { Attachment } from '../../types';

const AttachmentPreview: React.FC<{ attachments: Attachment[] }> = ({ attachments }) => {
  if (!attachments?.length) return null;
  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
      {attachments.map((attachment) => (
        <Box key={attachment.url} sx={{ width: 80, height: 80, borderRadius: 2, overflow: 'hidden' }}>
          {attachment.mimetype.startsWith('image') ? (
            <img src={attachment.url} alt={attachment.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Typography variant="caption">{attachment.filename}</Typography>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default AttachmentPreview;

