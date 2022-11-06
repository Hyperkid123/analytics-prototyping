import { Button, Grid } from '@mui/material';
import { useCustomEvent } from '../src/ReactClient';

const ClickCollection = () => {
  const event = useCustomEvent()
  return (
    <Grid container spacing={4}>
      <Grid item xs={4}>
        <Button onClick={() => {
          event('foo', {foo: 'bar'})
        }}>
          Click to collect foo event
        </Button>
      </Grid>
    </Grid>
  )
}

export default ClickCollection;
