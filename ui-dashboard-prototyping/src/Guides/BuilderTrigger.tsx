import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

const GuideBuildTrigger = ({ layoutId }: { layoutId: string }) => {
  const [domain, setDomain] = useState("");
  return (
    <Box>
      <Stack>
        <Typography variant="h4" component="h2">
          Pick guide builder domain
        </Typography>
        <Stack
          direction="row"
          sx={{ display: "flex", alignItems: "center" }}
          spacing={4}
        >
          <TextField
            value={domain}
            onChange={({ target: { value } }) => {
              setDomain(value);
            }}
            id="domain"
            label="Pick domain"
            variant="standard"
            helperText="type http://localhost:3000/pendo-building"
          />
          <Button
            LinkComponent="a"
            // always use this for testing, normally would use domain from state
            href={`http://localhost:3000/pendo-building?guide-launch=${layoutId}`}
            disabled={domain.length === 0}
            variant="contained"
          >
            Launch builder
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default GuideBuildTrigger;
