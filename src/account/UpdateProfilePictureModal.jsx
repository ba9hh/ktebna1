import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  CircularProgress,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";
import { supabase } from "../supabaseClient"; // make sure this is set up

const UpdateProfilePictureModal = ({
  open,
  handleClose,
  userId,
  userProfilePicture,
}) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  // cleanup previews
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      let uploadedImageUrl = userProfilePicture;

      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);

        uploadedImageUrl = publicUrlData.publicUrl;

        const { error: updateError } = await supabase
          .from("users")
          .update({ profile_picture: uploadedImageUrl })
          .eq("id", userId);

        if (updateError) throw updateError;
      }

      handleClose();
      setFile(null);
      setPreview(null);
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error("Failed to update profile picture. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setFile(f);
    setPreview(url);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Profile Picture</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <div className="flex justify-center">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <img
                src={userProfilePicture}
                alt="profile picture"
                className="w-32 h-32 rounded-full object-cover"
              />
            )}
          </div>
          <Button variant="outlined" component="label" sx={{ px: 12 }}>
            Upload Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleUpdate}
          disabled={loading || !file}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateProfilePictureModal;
