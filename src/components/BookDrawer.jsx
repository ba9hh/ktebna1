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
          <div className="flex justify-between items-start">
            <div className="grid gap-4 md:grid-cols-[200px_1fr]">
              <img
                src={book.book_image}
                alt={book.book_name}
                className="w-1/2 md:w-full aspect-3/4 rounded-xl object-cover"
              />
              <div>
                <p className="text-sm text-gray-700">
                  user have:{" "}
                  <span className="text-amber-700 font-medium">
                    {book.book_name}
                  </span>
                </p>
                <p className="text-sm text-gray-700">
                  {/* {t("BookDrawer.deal")}:{" "} */}
                  user wants:
                  <span className="text-amber-700 font-medium">
                    {book.book_deal}
                  </span>
                </p>
                <p className="text-sm text-gray-700">
                  {/* {t("BookDrawer.owner")}:{" "} */}
                  user:
                  <span className="text-amber-700 font-medium">
                    {book.users?.name || t("BookDrawer.you")}
                  </span>
                  disponible à:
                  <span className="text-amber-700 font-medium">
                    {book.book_location}
                  </span>
                </p>
                <p className="text-sm text-gray-700">
                  {/* {t("BookDrawer.deal")}:{" "} */}
                  book category:
                  <span className="text-amber-700 font-medium">
                    {book.book_category}
                  </span>
                </p>
                <p className="text-sm text-gray-700">
                  {/* {t("BookDrawer.deal")}:{" "} */}
                  deal type:
                  <span className="text-amber-700 font-medium">
                    {book.deal_type}
                  </span>
                </p>
                {/* <p className="font-medium">
                  {t("BookDrawer.location")}: {book.book_location}
                </p> */}
              </div>
            </div>
            <IconButton onClick={onClose}>
              <X className="h-5 w-5" />
            </IconButton>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default BookDrawer;
