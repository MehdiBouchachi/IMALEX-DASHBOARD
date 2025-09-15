import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import Button from "../../ui/Button";
import ButtonGroup from "../../ui/ButtonGroup";
import FileInput from "../../ui/FileInput";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

/* ──────────────────────────────────────────────────────────
   Static user store (localStorage)
────────────────────────────────────────────────────────── */
const KEY = "imalex:user:v1";
const DEFAULT_USER = {
  id: "me",
  email: "me@imalex.com",
  fullName: "Your Name",
  phone: "+213700000000",
  avatar:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
  // (for demo only; NOT secure)
  password: "changeme123",
};

function loadUser() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : DEFAULT_USER;
  } catch {
    return DEFAULT_USER;
  }
}
function saveUser(next) {
  localStorage.setItem(KEY, JSON.stringify(next));
}

/* ──────────────────────────────────────────────────────────
   UI bits
────────────────────────────────────────────────────────── */
const AvatarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
const Avatar = styled.div`
  width: 84px;
  height: 84px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--color-grey-200);
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;
const Note = styled.p`
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--color-grey-600);
`;

/* phone validation (E.164-like) */
const normalizePhone = (raw = "") => raw.replace(/[()\s.-]/g, "");
const isValidInternationalPhone = (raw = "") =>
  /^\+?[1-9]\d{7,14}$/.test(normalizePhone(raw));

/* helper to get DataURL for avatar persistence */
const fileToDataURL = (file) =>
  new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });

export default function UpdateUserDataForm() {
  const user = useMemo(loadUser, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    defaultValues: {
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      avatarFile: null,
    },
    mode: "onBlur",
  });

  const [preview, setPreview] = useState(user.avatar);

  // live preview of chosen avatar
  const avatarFile = watch("avatarFile");
  useEffect(() => {
    const file = avatarFile?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  async function onSubmit(form) {
    // normalize + validate phone
    const phone = normalizePhone(form.phone);
    if (!isValidInternationalPhone(phone)) return;

    let avatarData = user.avatar;
    const file = form.avatarFile?.[0];
    if (file) avatarData = await fileToDataURL(file); // persistable

    const next = {
      ...user,
      fullName: form.fullName.trim(),
      phone,
      avatar: avatarData,
    };
    saveUser(next);
    reset({ ...form, phone, avatarFile: null });
  }

  function onCancel() {
    reset({
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      avatarFile: null,
    });
    setPreview(user.avatar);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} type="regular">
      <FormRow label="Email address">
        <Input id="email" value={user.email} disabled />
      </FormRow>

      <FormRow
        label="Full name"
        controlId="fullName"
        error={errors.fullName?.message}
      >
        <Input
          id="fullName"
          placeholder="Your name"
          disabled={isSubmitting}
          {...register("fullName", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Phone" controlId="phone" error={errors.phone?.message}>
        <Input
          id="phone"
          type="tel"
          placeholder="+213700000000"
          disabled={isSubmitting}
          {...register("phone", {
            required: "This field is required",
            validate: (v) =>
              isValidInternationalPhone(v) ||
              "Use international format, e.g. +213700000000",
          })}
          onBlur={(e) => setValue("phone", normalizePhone(e.target.value))}
        />
      </FormRow>

      <FormRow label="Avatar">
        <AvatarRow>
          <Avatar>
            <img src={preview} alt="Avatar preview" />
          </Avatar>
          <FileInput accept="image/*" {...register("avatarFile")} />
        </AvatarRow>
        <Note>Square images look best (min 256×256).</Note>
      </FormRow>

      <FormRow>
        <ButtonGroup>
          <Button
            type="reset"
            variation="secondary"
            onClick={onCancel}
            disabled={isSubmitting || !isDirty}
          >
            Cancel
          </Button>
          <Button disabled={isSubmitting || !isDirty}>Update account</Button>
        </ButtonGroup>
      </FormRow>
    </Form>
  );
}
