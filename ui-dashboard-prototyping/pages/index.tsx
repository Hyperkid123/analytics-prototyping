import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText'
import Avatar from '@mui/material/Avatar';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { ListItemButton } from '@mui/material';

import Link from '../src/Link';
import navigationData from '../src/Navigation/navigation-data'

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Analytics service prototype
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Feel free to roam around. We will be watching.
        </Typography>
        <RemoveRedEyeIcon color="info" fontSize="large" />
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {navigationData.map(({ href, primary, secondary, Icon }) => (
            <ListItem key={href}>
              <ListItemButton href={href} component={Link}>
                <ListItemAvatar>
                  <Avatar>
                    <Icon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={primary} secondary={secondary} />
              </ListItemButton>
            </ListItem>

          ))}
        </List>
      </Box>
    </Container>
  );
}