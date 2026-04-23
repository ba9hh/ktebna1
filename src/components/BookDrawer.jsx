import React from "react";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
const BookDrawer = ({ open, onClose, book }) => {
  const { t } = useTranslation();
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        className: "rounded-t-2xl p-6 bg-white dark:bg-stone-900",
      }}
    >
      {book && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <IconButton onClick={onClose}>
              <X className="h-5 w-5" />
            </IconButton>
            <div className="grid gap-4 md:grid-cols-[200px_1fr]">
              <img
                src={book.book_image}
                alt={book.book_name}
                className="w-1/2 md:w-full aspect-3/4 rounded-xl object-cover"
              />
              <div>
                <p className="font-medium">user have: {book.book_name}</p>
                <p className="font-medium">
                  {/* {t("BookDrawer.deal")}:{" "} */}
                  <span className="text-amber-700">
                    user wants:{book.book_deal}
                  </span>
                </p>
                <p className="font-medium">
                  {t("BookDrawer.owner")}:{" "}
                  {book.users?.name || t("BookDrawer.you")}
                </p>
                <p className="font-medium">
                  {t("BookDrawer.location")}: {book.book_location}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default BookDrawer;
