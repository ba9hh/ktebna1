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

const DeletePostModal = ({ open, onClose, post }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  if (!open) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from("posts")
        .delete()
        .eq("id", post.id);

      if (deleteError) throw deleteError;

      if (post.book_image) {
        const fileName = post.book_image.split("/").pop();
        const { error: storageError } = await supabase.storage
          .from("images")
          .remove([fileName]);

        if (storageError) {
          console.warn("Image delete failed:", storageError.message);
        }
      }

      toast.success(t("deletePostModal.deleteSuccess"));
      onClose(true);
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error(t("deletePostModal.deleteError"));
      onClose(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "center" }}>
        {t("deletePostModal.title")}
      </DialogTitle>
      <DialogContent dividers>
        <Typography align="center">
          {t("deletePostModal.confirmMessage")}
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

export default DeletePostModal;
