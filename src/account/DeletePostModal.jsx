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
import { supabase } from "../supabaseClient";

const DeletePostModal = ({ open, onClose, post }) => {
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

      toast.success("Post deleted successfully!");
      onClose(true);
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post. Please try again.");
      onClose(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "center" }}>Delete Post</DialogTitle>
      <DialogContent dividers>
        <Typography align="center">
          Are you sure you want to delete this post? This action cannot be
          undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePostModal;
