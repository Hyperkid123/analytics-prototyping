import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { ComponentTypes } from "./componentMapper";

const WidgetSelector = ({
  widgetList,
  handleAddWidget,
}: {
  widgetList: ComponentTypes[];
  handleAddWidget: (widgetType: ComponentTypes) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography component="h1" variant="h4">
            Your dashboard
          </Typography>
          <Button
            onClick={() => setIsOpen(true)}
            color="secondary"
            startIcon={<AddIcon />}
          >
            Add new widget
          </Button>
        </Box>
      </Paper>
      <Drawer anchor="right" open={isOpen} onClose={() => setIsOpen(false)}>
        <Box sx={{ pl: 4, pt: 2, pb: 2 }}>
          <Typography component="h3" variant="h6">
            Select new widget
          </Typography>
        </Box>
        <Divider />
        <List sx={{ width: 350, pt: 1 }}>
          {widgetList.map((widget) => (
            <ListItem key={widget}>
              <ListItemButton
                onClick={() => {
                  handleAddWidget(widget);
                  setIsOpen(false);
                }}
              >
                <ListItemText primary={widget} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default WidgetSelector;
