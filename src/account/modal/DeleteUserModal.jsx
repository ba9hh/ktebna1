import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { supabase } from "../../supabaseClient";
import { useTranslation } from "react-i18next";

const DeleteUserModal = ({ open, onClose, userId }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from("users")
        .delete()
        .eq("id", userId);

      if (deleteError) throw deleteError;

      const { error: authError } = await supabase.rpc("delete_user");

      if (authError) throw authError;

      toast.success(t("deleteAccountModal.deleteSuccess"));

      await supabase.auth.signOut();

      onClose();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error(t("deleteAccountModal.deleteError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "center" }}>
        {t("deleteAccountModal.title")}
      </DialogTitle>
      <DialogContent dividers>
        <Typography align="center">
          {t("deleteAccountModal.confirmMessage")}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} color="inherit">
          {t("deletePostModal.cancel")}
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            t("deletePostModal.delete")
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUserModal;
