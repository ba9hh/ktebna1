import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  Typography,
  FormHelperText,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { supabase } from "../supabaseClient";
import { toast } from "react-toastify";
import cities from "../data/cities";
import CATEGORIES from "../data/categories";

const UpdatePostModal = ({ open, onClose, post }) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      category: "",
      type: "",
      deal: "",
      location: "",
      image: null,
    },
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fill form when editing
  useEffect(() => {
    if (post) {
      reset({
        name: post.book_name || "",
        category: post.book_category || "",
        type: post.book_deal_type || "",
        deal: post.book_deal || "",
        location: post.book_location || "",
        image: null,
      });
      setImagePreview(post.book_image || null);
    }
  }, [post, reset]);

  if (!open) return null;

  const onSubmit = async (data) => {
    setLoading(true);
    let uploadedImageUrl = post.book_image; // keep old if no new upload

    try {
      // Upload new file if selected
      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;

        const { error: storageError } = await supabase.storage
          .from("images") // bucket name
          .upload(fileName, file, { upsert: true });

        if (storageError) throw storageError;

        const { data: publicUrlData } = supabase.storage
          .from("images")
          .getPublicUrl(fileName);

        uploadedImageUrl = publicUrlData.publicUrl;
      }

      // Update post in Supabase
      const { error: updateError } = await supabase
        .from("posts")
        .update({
          book_name: data.name,
          book_category: data.category,
          book_deal_type: data.type,
          book_deal: data.deal,
          book_location: data.location,
          book_image: uploadedImageUrl,
        })
        .eq("id", post.id); // make sure your primary key is "id"

      if (updateError) throw updateError;

      toast.success("Post updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "center" }}>Update Product</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <div style={{ marginBottom: 20 }}>
                <Button variant="contained" component="label">
                  {imagePreview ? "Change Image" : "Upload Book Image"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setFile(file);
                      field.onChange(file);
                      setImagePreview(file ? URL.createObjectURL(file) : null);
                    }}
                  />
                </Button>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      display: "block",
                      marginTop: 10,
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                )}
              </div>
            )}
          />

          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <TextField
                label="Book Name"
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message}
                {...field}
              />
            )}
          />

          <Controller
            name="category"
            control={control}
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <FormControl fullWidth margin="normal" error={!!errors.category}>
                <InputLabel>Book Category</InputLabel>
                <Select {...field} label="Book Category">
                  {CATEGORIES.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.category?.message}</FormHelperText>
              </FormControl>
            )}
          />

          <div className="flex gap-2">
            <Controller
              name="type"
              control={control}
              rules={{ required: "Type of transaction is required" }}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" error={!!errors.type}>
                  <InputLabel>Deal Type</InputLabel>
                  <Select {...field} label="Deal Type">
                    {["sell", "exchange"].map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.type?.message}</FormHelperText>
                </FormControl>
              )}
            />
            <Controller
              name="deal"
              control={control}
              rules={{
                required: "This field is required",
              }}
              render={({ field }) => (
                <TextField
                  label="Price or Exchange"
                  placeholder="Ex: 30 DT or 'Exchange with Atomic Habits'"
                  type="text"
                  fullWidth
                  margin="normal"
                  error={!!errors.deal}
                  helperText={errors.deal?.message}
                  {...field}
                />
              )}
            />
          </div>

          <Controller
            name="location"
            control={control}
            rules={{ required: "Location is required" }}
            render={({ field }) => (
              <FormControl fullWidth margin="normal" error={!!errors.location}>
                <InputLabel>Book Location</InputLabel>
                <Select {...field} label="Book Location">
                  {cities.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.location?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isValid || loading}
          >
            {loading ? <CircularProgress size={24} /> : "Update"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UpdatePostModal;
