import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Stack,
  Divider,
  useTheme,
  Box,
  Button,
} from "@mui/material";
import { X } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { toast } from "react-toastify";

const LoginModal = ({
  open,
  onClose,
  message = "You must be logged in to perform this action.",
}) => {
  const { loginWithGoogle } = useContext(AuthContext);
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 0,
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          bgcolor: theme.palette.primary.main,
          color: "#fff",
          py: 2,
        }}
      >
        <DialogTitle sx={{ textAlign: "center", m: 0, fontSize: "1.5rem" }}>
          Authentication Required
        </DialogTitle>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#fff",
          }}
        >
          <X size={14} />
        </IconButton>
      </Box>

      <DialogContent sx={{ textAlign: "center", pt: 3, px: 4, pb: 6 }}>
        <Typography variant="body1" gutterBottom>
          {message}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={2}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 2,
              py: 1.5,
              borderRadius: 2,
              border: `1px solid ${theme.palette.grey[300]}`,
              cursor: "pointer",
              transition: "background-color 0.2s",
              "&:hover": {
                bgcolor: theme.palette.grey[100],
              },
            }}
          >
            {/* <GoogleIcon sx={{ mr: 1, color: "#DB4437" }} /> */}
            <Button variant="button" sx={{ fontWeight: 500 }}>
              Continue with Google
            </Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
