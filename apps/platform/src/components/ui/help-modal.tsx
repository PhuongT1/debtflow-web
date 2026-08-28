"use client";

import { useState } from "react";
import {
  Box,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { AppIcon } from "@/components/ui/app-icon";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";

type HelpModalProps = {
  title: string;
  description: string;
  steps: string[];
  tips?: string[];
};

export function HelpModal({ title, description, steps, tips = [] }: HelpModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button className="gap-2" startIcon={<AppIcon fontSize="small" name="help" />} type="button" variant="secondary" onClick={() => setOpen(true)}>
        Hướng dẫn
      </Button>

      <AppDialog fullWidth maxWidth="sm" open={open} onClose={() => setOpen(false)}>
        <DialogTitle sx={{ pr: 6 }}>
          <Typography component="div" sx={{ fontSize: 20, fontWeight: 900 }}>
            {title}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {description}
          </Typography>
          <IconButton aria-label="Đóng hướng dẫn" onClick={() => setOpen(false)} sx={{ position: "absolute", right: 12, top: 12 }}>
            <AppIcon fontSize="small" name="close" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ fontWeight: 800 }}>Làm theo thứ tự</Typography>
          <List>
            {steps.map((step, index) => (
              <ListItem key={step} sx={{ alignItems: "flex-start", bgcolor: "action.hover", borderRadius: 2, mb: 1 }}>
                <Box
                  sx={{
                    alignItems: "center",
                    bgcolor: "primary.main",
                    borderRadius: "999px",
                    color: "primary.contrastText",
                    display: "flex",
                    fontSize: 12,
                    fontWeight: 900,
                    height: 24,
                    justifyContent: "center",
                    mr: 1.5,
                    mt: 0.25,
                    width: 24,
                  }}
                >
                  {index + 1}
                </Box>
                <Typography sx={{ fontSize: 14 }}>{step}</Typography>
              </ListItem>
            ))}
          </List>
          {tips.length > 0 ? (
            <>
              <Typography sx={{ fontWeight: 800, mt: 2 }}>
                Mẹo dùng nhanh
              </Typography>
              <List>
                {tips.map((tip) => (
                  <ListItem key={tip} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, mb: 1 }}>
                    <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                      {tip}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </>
          ) : null}
        </DialogContent>
      </AppDialog>
    </>
  );
}
