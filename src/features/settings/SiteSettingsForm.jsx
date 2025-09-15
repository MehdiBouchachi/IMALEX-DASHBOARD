import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import {
  FaEnvelope,
  FaPhone,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
  FaArrowUpRightFromSquare,
} from "react-icons/fa6";

import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import ButtonGroup from "../../ui/ButtonGroup";
import Spinner from "../../ui/Spinner";

import { DEFAULT_SETTINGS, useSiteSettings } from "./useSiteSettings";

/* ──────────────────────────────────────────────────────────
   Layout
────────────────────────────────────────────────────────── */
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 980px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Section = styled.section`
  border: 1px solid var(--color-grey-100);
  background: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  padding: 1.4rem;
`;

const SectionHead = styled.div`
  display: grid;
  gap: 4px;
  margin-bottom: 12px;
`;
const SectionTitle = styled.h3`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
`;
const SectionHint = styled.p`
  margin: 0;
  color: var(--color-grey-600);
  font-size: 1.25rem;
`;

/* Input adornments (icon left + small actions right) */
const FieldWrap = styled.div`
  position: relative;
`;
const LeftIcon = styled.span`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  color: var(--color-grey-600);
  pointer-events: none;
`;
const RightActions = styled.div`
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  gap: 6px;
`;
const IconButton = styled.button.attrs({ type: "button" })`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  width: 28px;
  border-radius: 8px;
  border: 1px solid var(--color-grey-200);
  background: var(--color-grey-0);
  color: var(--color-grey-700);
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:not(:disabled):hover {
    background: var(--color-grey-100);
  }
`;

/* Make space for the left icon inside your Input */
const IconInput = styled(Input)`
  padding-left: 36px;
`;

/* ──────────────────────────────────────────────────────────
   Validators / normalizers
────────────────────────────────────────────────────────── */
const emailPattern = /\S+@\S+\.\S+/;
const normalizePhone = (raw = "") => raw.replace(/[()\s.-]/g, "");
const isValidInternationalPhone = (raw = "") =>
  /^\+?[1-9]\d{7,14}$/.test(normalizePhone(raw));

const withProtocol = (url = "") =>
  url && !/^https?:\/\//i.test(url) ? `https://${url}` : url;

const urlPattern = /^(https?:\/\/)(?:(?!\s)[\w-]+(?:\.[\w-]+)+)(?:[^\s]*)$/i;

/* ──────────────────────────────────────────────────────────
   Component
────────────────────────────────────────────────────────── */
export default function UpdateSettingsForm() {
  const { setting, isLoading, isSaving, save } = useSiteSettings();

  const defaults = useMemo(() => setting || DEFAULT_SETTINGS, [setting]);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: defaults,
    mode: "onBlur",
  });

  useEffect(() => {
    if (!isLoading) reset(defaults);
  }, [isLoading, defaults, reset]);

  const values = watch();

  const openUrl = (u) => {
    if (!u) return;
    const final = withProtocol(u);
    if (urlPattern.test(final)) window.open(final, "_blank", "noopener");
  };

  const onSubmit = async (form) => {
    const next = {
      contact: {
        email: form.contact.email.trim(),
        phone: normalizePhone(form.contact.phone),
      },
      socials: {
        facebook: withProtocol(form.socials.facebook.trim()),
        instagram: withProtocol(form.socials.instagram.trim()),
        linkedin: withProtocol(form.socials.linkedin.trim()),
        x: withProtocol(form.socials.x.trim()),
      },
    };
    await save(next);
    reset(next);
  };

  if (isLoading) return <Spinner />;

  return (
    <Form onSubmit={handleSubmit(onSubmit)} type="regular">
      <Grid>
        {/* Contact */}
        <Section>
          <SectionHead>
            <SectionTitle>Contact</SectionTitle>
            <SectionHint>
              Email and phone shown on your public site.
            </SectionHint>
          </SectionHead>

          <FormRow
            label="Email"
            controlId="contact-email"
            error={errors?.contact?.email?.message}
          >
            <FieldWrap>
              <LeftIcon>
                <FaEnvelope size={16} />
              </LeftIcon>
              <IconInput
                id="contact-email"
                type="email"
                placeholder="name@imalex.com"
                {...register("contact.email", {
                  required: "This field is required",
                  pattern: {
                    value: emailPattern,
                    message: "Provide a valid email",
                  },
                })}
              />
            </FieldWrap>
          </FormRow>

          <FormRow
            label="Phone"
            controlId="contact-phone"
            error={errors?.contact?.phone?.message}
          >
            <FieldWrap>
              <LeftIcon>
                <FaPhone size={16} />
              </LeftIcon>
              <IconInput
                id="contact-phone"
                type="tel"
                placeholder="+213700000000"
                {...register("contact.phone", {
                  required: "This field is required",
                  validate: (v) =>
                    isValidInternationalPhone(v) ||
                    "Use international format, e.g. +213700000000",
                })}
                onBlur={(e) =>
                  setValue("contact.phone", normalizePhone(e.target.value))
                }
              />
            </FieldWrap>
          </FormRow>
        </Section>

        {/* Socials */}
        <Section>
          <SectionHead>
            <SectionTitle>Socials</SectionTitle>
            <SectionHint>
              Use full links. Empty fields won’t be shown.
            </SectionHint>
          </SectionHead>

          <FormRow
            label="Facebook"
            controlId="social-fb"
            error={errors?.socials?.facebook?.message}
          >
            <FieldWrap>
              <LeftIcon>
                <FaFacebook size={16} />
              </LeftIcon>
              <IconInput
                id="social-fb"
                placeholder="https://facebook.com/imalex"
                {...register("socials.facebook", {
                  validate: (v) =>
                    !v || urlPattern.test(withProtocol(v)) || "Invalid URL",
                })}
                onBlur={(e) =>
                  setValue(
                    "socials.facebook",
                    withProtocol(e.target.value.trim())
                  )
                }
              />
              <RightActions>
                <IconButton
                  aria-label="Open Facebook link"
                  title="Open"
                  onClick={() => openUrl(values?.socials?.facebook)}
                  disabled={!values?.socials?.facebook}
                >
                  <FaArrowUpRightFromSquare size={12} />
                </IconButton>
              </RightActions>
            </FieldWrap>
          </FormRow>

          <FormRow
            label="Instagram"
            controlId="social-ig"
            error={errors?.socials?.instagram?.message}
          >
            <FieldWrap>
              <LeftIcon>
                <FaInstagram size={16} />
              </LeftIcon>
              <IconInput
                id="social-ig"
                placeholder="https://instagram.com/imalex"
                {...register("socials.instagram", {
                  validate: (v) =>
                    !v || urlPattern.test(withProtocol(v)) || "Invalid URL",
                })}
                onBlur={(e) =>
                  setValue(
                    "socials.instagram",
                    withProtocol(e.target.value.trim())
                  )
                }
              />
              <RightActions>
                <IconButton
                  aria-label="Open Instagram link"
                  title="Open"
                  onClick={() => openUrl(values?.socials?.instagram)}
                  disabled={!values?.socials?.instagram}
                >
                  <FaArrowUpRightFromSquare size={12} />
                </IconButton>
              </RightActions>
            </FieldWrap>
          </FormRow>

          <FormRow
            label="LinkedIn"
            controlId="social-in"
            error={errors?.socials?.linkedin?.message}
          >
            <FieldWrap>
              <LeftIcon>
                <FaLinkedin size={16} />
              </LeftIcon>
              <IconInput
                id="social-in"
                placeholder="https://www.linkedin.com/company/imalex"
                {...register("socials.linkedin", {
                  validate: (v) =>
                    !v || urlPattern.test(withProtocol(v)) || "Invalid URL",
                })}
                onBlur={(e) =>
                  setValue(
                    "socials.linkedin",
                    withProtocol(e.target.value.trim())
                  )
                }
              />
              <RightActions>
                <IconButton
                  aria-label="Open LinkedIn link"
                  title="Open"
                  onClick={() => openUrl(values?.socials?.linkedin)}
                  disabled={!values?.socials?.linkedin}
                >
                  <FaArrowUpRightFromSquare size={12} />
                </IconButton>
              </RightActions>
            </FieldWrap>
          </FormRow>

          <FormRow
            label="X (Twitter)"
            controlId="social-x"
            error={errors?.socials?.x?.message}
          >
            <FieldWrap>
              <LeftIcon>
                <FaXTwitter size={16} />
              </LeftIcon>
              <IconInput
                id="social-x"
                placeholder="https://x.com/imalex"
                {...register("socials.x", {
                  validate: (v) =>
                    !v || urlPattern.test(withProtocol(v)) || "Invalid URL",
                })}
                onBlur={(e) =>
                  setValue("socials.x", withProtocol(e.target.value.trim()))
                }
              />
              <RightActions>
                <IconButton
                  aria-label="Open X link"
                  title="Open"
                  onClick={() => openUrl(values?.socials?.x)}
                  disabled={!values?.socials?.x}
                >
                  <FaArrowUpRightFromSquare size={12} />
                </IconButton>
              </RightActions>
            </FieldWrap>
          </FormRow>
        </Section>
      </Grid>

      <ButtonGroup>
        <Button
          variation="secondary"
          type="button"
          onClick={() => reset(defaults)}
          disabled={isSaving || !isDirty}
        >
          Cancel
        </Button>
        <Button disabled={isSaving || !isDirty}>
          {isSaving ? "Saving…" : "Save changes"}
        </Button>
      </ButtonGroup>
    </Form>
  );
}
