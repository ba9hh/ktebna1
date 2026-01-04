import React, { useState } from "react";
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
import { supabase } from "../../supabaseClient";
import { toast } from "react-toastify";
import cities from "../../data/cities";
import CATEGORIES from "../../data/categories";
import { useTranslation } from "react-i18next";
const AddPostModal = ({ open, onClose, userId }) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      name: "",
      category: "",
      deal: "",
      type: "",
      location: "",
      image: null,
    },
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  if (!open) return null;

  const onSubmit = async (data) => {
    setLoading(true);
    let uploadedImageUrl = "";
    try {
      // 1. Upload image to Supabase storage
      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data: storageData, error: storageError } =
          await supabase.storage.from("images").upload(fileName, file);

        if (storageError) throw storageError;

        const { data: publicUrlData } = supabase.storage
          .from("images")
          .getPublicUrl(fileName);

        uploadedImageUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("posts").insert([
        {
          user_id: userId,
          book_name: data.name,
          book_category: data.category,
          book_deal: data.deal,
          book_deal_type: data.type,
          book_image: uploadedImageUrl,
          book_location: data.location,
        },
      ]);

      if (insertError) throw insertError;

      toast.success(t("addPostModal.productAddSuccess"));
      onClose();
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(t("addPostModal.productAddError"));
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "center" }}>
        {t("addPostModal.title")}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Controller
            name="image"
            control={control}
            rules={{ required: t("addPostModal.imageRequired") }}
            render={({ field }) => (
              <div style={{ marginBottom: 20 }}>
                <Button variant="contained" component="label">
                  {t("addPostModal.uploadImage")}
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
                {errors.image && (
                  <Typography color="error">{errors.image.message}</Typography>
                )}
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
            rules={{ required: t("addPostModal.nameRequired") }}
            render={({ field }) => (
              <TextField
                label={t("addPostModal.bookName")}
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
            rules={{ required: t("addPostModal.categoryRequired") }}
            render={({ field }) => (
              <FormControl fullWidth margin="normal" error={!!errors.category}>
                <InputLabel>{t("addPostModal.bookCategory")}</InputLabel>
                <Select {...field} label={t("addPostModal.bookCategory")}>
                  {CATEGORIES.map((c) => (
                    <MenuItem key={c} value={c}>
                      {t(`categories.${c}`)}
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
              rules={{ required: t("addPostModal.typeRequired") }}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" error={!!errors.type}>
                  <InputLabel>{t("addPostModal.dealType")}</InputLabel>
                  <Select {...field} label={t("addPostModal.dealType")}>
                    {["sell", "exchange", "donate"].map((c) => (
                      <MenuItem key={c} value={c}>
                        {t(`filterPanel.${c}`)}
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
              rules={{ required: t("addPostModal.fieldRequired") }}
              render={({ field }) => (
                <TextField
                  label={t("addPostModal.priceOrExchange")}
                  placeholder={t("addPostModal.priceExchangePlaceholder")}
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
            rules={{ required: t("addPostModal.locationRequired") }}
            render={({ field }) => (
              <FormControl fullWidth margin="normal" error={!!errors.location}>
                <InputLabel>{t("addPostModal.bookLocation")}</InputLabel>
                <Select {...field} label={t("addPostModal.bookLocation")}>
                  {cities.map((c) => (
                    <MenuItem key={c} value={c}>
                      {t(`cities.${c}`)}
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
            {t("addPostModal.cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isValid || loading}
          >
            {loading ? <CircularProgress size={24} /> : t("addPostModal.save")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddPostModal;
