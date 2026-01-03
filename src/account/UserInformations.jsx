import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import UpdateProfilePictureModal from "./modal/UpdateProfilePictureModal";
import { supabase } from "../supabaseClient";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
const UserInformations = () => {
  const { t } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState("");

  const fetchUserInformation = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, profile_picture")
      .eq("id", user.id)
      .single();

    if (error) throw error;
    console.log(data);
    return data;
  };
  const {
    data: userInfo,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["userInfo"],
    queryFn: () => fetchUserInformation(),
  });
  useEffect(() => {
    if (user?.name) setNewName(user.name);
  }, [user]);
  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ name: newName })
        .eq("id", userInfo.id);

      if (error) throw error;

      toast.success(t("userInfo.nameUpdateSuccess"));
      setEditMode(false);
      refetch();
    } catch (error) {
      console.error("Error updating name:", error);
      toast.error(t("userInfo.nameUpdateError"));
    }
  };

  return (
    <div className="flex flex-col items-center w-full md:w-fit p-6 gap-3 border rounded-xl shadow-md">
      <div className="relative inline-block group w-16 h-16">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute bottom-0 -right-2 hover:bg-gray-100 bg-white rounded-full p-1 shadow-md transition-opacity focus:outline-none"
        >
          <Pencil size={14} color="#4B5563" />
        </button>
        <img
          src={userInfo?.profile_picture}
          alt="Profile picture"
          className="w-16 h-16 object-cover rounded-full"
        />
      </div>
      {!editMode ? (
        <>
          <div className="flex flex-col items-center">
            <h1>{userInfo?.name}</h1>
            <p>{userInfo?.email}</p>
          </div>
          <div className="flex gap-3 mt-3">
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-3 py-1 text-sm rounded-lg border bg-gray-100 hover:bg-gray-200"
            >
              {t("userInfo.edit")}
            </button>
            <button
              onClick={logout}
              className="px-3 py-1 text-sm rounded-lg border bg-red-500 text-white hover:bg-red-600"
            >
              {t("userInfo.logout")}
            </button>
          </div>
        </>
      ) : (
        <>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={t("userInfo.namePlaceholder")}
            className="border rounded-xl p-2"
          />
          <div className="flex gap-3 mt-3">
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-3 py-1 text-sm rounded-lg border bg-gray-100 hover:bg-gray-200"
            >
              {t("userInfo.cancel")}
            </button>
            <button
              onClick={handleSave}
              disabled={
                newName == userInfo?.name || newName.trim()?.length === 0
              }
              className={`px-3 py-1 text-sm rounded-lg border text-white ${
                newName === userInfo?.name || newName.trim().length === 0
                  ? "bg-gray-400 "
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {t("userInfo.save")}
            </button>
          </div>
        </>
      )}
      {open && (
        <UpdateProfilePictureModal
          open={open}
          handleClose={() => setOpen(false)}
          userId={userInfo?.id}
          userProfilePicture={userInfo?.profile_picture}
        />
      )}
    </div>
  );
};

export default UserInformations;
