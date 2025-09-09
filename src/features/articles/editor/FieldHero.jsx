import React from "react";
import FormRow from "../../../ui/FormRow";
import FileInput from "../../../ui/FileInput";
import Button from "../../../ui/Button";

export default function FieldHero({ preview, onPick, onClear, note }) {
  const handleChange = (payload) => {
    const file = payload?.target?.files?.[0] || payload?.file || payload;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onPick({ file, dataUrl: reader.result });
    reader.readAsDataURL(file);
  };

  return (
    <FormRow label="Hero image" controlId="heroFile">
      <div style={{ display: "grid", gap: 10, width: "100%" }}>
        <FileInput
          id="heroFile"
          accept="image/*"
          onChange={handleChange}
          aria-describedby="hero-hint"
          label="Choose an image"
          hint={note || "PNG/JPG; used in lists and article detail"}
        />
        <span
          id="hero-hint"
          style={{ color: "var(--color-grey-600)", fontSize: 12 }}
        >
          {note || "PNG/JPG; used in lists and article detail"}
        </span>

        {preview ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              border: "1px dashed var(--color-grey-200)",
              background: "var(--color-grey-50)",
              borderRadius: "var(--border-radius-md)",
              padding: 10,
              width: "100%",
            }}
          >
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img
              src={preview}
              alt="Hero preview"
              style={{
                height: 72,
                width: 72,
                borderRadius: 10,
                objectFit: "cover",
                boxShadow: "var(--shadow-sm)",
              }}
            />
            <Button
              size="small"
              variation="secondary"
              type="button"
              onClick={onClear}
            >
              Remove
            </Button>
          </div>
        ) : null}
      </div>
    </FormRow>
  );
}
