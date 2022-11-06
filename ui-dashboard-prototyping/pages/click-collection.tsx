import { Button, Grid } from '@mui/material';
import { createRandomUser, User } from '../mock/user';
import { useCustomEvent, useIdentify } from '../src/ReactClient';

const ClickCollection = () => {
  const event = useCustomEvent()
  const identify = useIdentify()
  return (
    <Grid container spacing={4}>
      <Grid item xs={4}>
        <Button onClick={() => {
          event('foo', {foo: 'bar'})
        }}>
          Click to collect foo event
        </Button>
      </Grid>
      <Grid item xs={4}>
        <Button onClick={() => {
          identify<User>(createRandomUser())
        }}>
          Click to identify new user
        </Button>
      </Grid>
    </Grid>
  )
}

export default ClickCollection;
