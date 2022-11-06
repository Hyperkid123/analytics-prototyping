import { Button, Grid } from '@mui/material';
import { createRandomContext, EventContext } from '../mock/context';
import { createRandomUser, User } from '../mock/user';
import { useCustomEvent, useIdentify, useUpdateContext } from '../src/ReactClient';

const ClickCollection = () => {
  const event = useCustomEvent()
  const identify = useIdentify()
  const updateContext = useUpdateContext()
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
      <Grid item xs={4}>
        <Button onClick={() => {
          updateContext(createRandomContext())
        }}>
          Click to update client context
        </Button>
      </Grid>
    </Grid>
  )
}

export default ClickCollection;
