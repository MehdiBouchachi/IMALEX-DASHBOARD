import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Row from "../../ui/Row";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import Textarea from "../../ui/Textarea";
import Heading from "../../ui/Heading";
import Button from "../../ui/Button";
import ButtonGroup from "../../ui/ButtonGroup";

import BlockEditor from "./editor/BlockEditor";
import AdminPreview from "./editor/AdminPreview";

import {
  Page,
  Shell,
  Ribbon,
  Card,
  WordPage,
  TitleInput,
} from "../../ui/PageShell";
import Stepper from "../../ui/Stepper";
import FieldSlug from "../../ui/FieldSlug";
import FieldHero from "./editor/FieldHero";
import TagInput from "../../ui/TagInput";
import { useArticleEditorState } from "./useArticleEditorState";

/* --- Preview modal shell --- */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: ${(p) => (p.open ? "grid" : "none")};
  place-items: center;
  z-index: 50;
`;
const PreviewPanel = styled.div`
  width: min(980px, 96vw);
  max-height: 90vh;
  overflow: auto;
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  padding: 16px;
`;

/* --------------------------- data --------------------------- */
const TEAMS = [
  { id: 1, slug: "cosmetics", name: "Cosmetics" },
  { id: 2, slug: "food-supplements", name: "Food supplements" },
  {
    id: 3,
    slug: "biofertilizers-biopesticides",
    name: "Biofertilizers & Biopesticides",
  },
  { id: 4, slug: "animal-nutrition", name: "Animal Nutrition" },
  { id: 5, slug: "agri-food", name: "Agri-Food" },
];
const VISIBILITY = ["public", "team", "selected", "private"];
const CREDIT = ["team", "author"];

/* --------------------------- main --------------------------- */
export default function ArticleCreate({ mode = "create", initial = null }) {
  const navigate = useNavigate();

  // state lives in a separate hook now
  const { state, actions, bodyPreview, hasContent } = useArticleEditorState({
    mode,
    initial,
    fallbackTeamId: TEAMS[0].id,
  });

  const {
    step,
    showPreview,
    title,
    blocks,
    slug,
    lockSlug,
    slugTouched, // (kept for completeness)
    publishCredit,
    teamId,
    visibility,
    selectedUserIds,
    heroFile,
    heroPreview,
    readTimeMin,
    excerpt,
    tags,
    initialAuthor,
    initialCreatedAt,
    initialPublishedAt,
    initialStatus,
    initialId,
  } = state;

  const canNextFromWrite = hasContent;

  // payload (same as before, but cleaner)
  const makePayload = (intent) => {
    const now = new Date().toISOString();
    const team = TEAMS.find((t) => t.id === Number(teamId)) || null;
    const author = initialAuthor ?? { id: "me", displayName: "Current User" };

    const nextStatus =
      mode === "edit"
        ? initialStatus
        : intent === "submit"
        ? "in_review"
        : intent === "publish"
        ? "published"
        : "draft";

    return {
      id: initialId ?? crypto.randomUUID(),
      slug: slug || null,
      title,
      excerpt: excerpt || null,
      bodyPreview,
      hero: heroFile
        ? heroFile
        : heroPreview
        ? { url: heroPreview, alt: "" }
        : null,
      tags,
      readTimeMin: Number(readTimeMin) || null,
      author,
      team,
      publishCredit,
      visibility,
      status: nextStatus,
      allowedUserIds:
        visibility === "selected"
          ? selectedUserIds
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      createdAt: initialCreatedAt ?? now,
      publishedAt:
        mode === "edit"
          ? initialPublishedAt
          : intent === "publish"
          ? now
          : null,
      bodyBlocks: blocks,
    };
  };

  const submit = (intent) => (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title is required.");
    if (!slug.trim()) return alert("Slug is required.");
    if (visibility === "selected" && !selectedUserIds.trim())
      return alert("Provide selected user IDs or change visibility.");

    const payload = makePayload(intent);
    console.log("Article payload →", payload);

    if (mode === "edit") {
      alert("(static) Changes saved. Open console to inspect payload.");
      navigate(`/articles/${payload.id}`);
    } else {
      alert(
        `(static) ${
          intent === "publish"
            ? "Published"
            : intent === "submit"
            ? "Submitted for review"
            : "Draft saved"
        }.\nOpen console to inspect payload.`
      );
      navigate("/articles");
    }
  };

  /* ---- meta for AdminPreview ---- */
  const teamName = TEAMS.find((t) => t.id === Number(teamId))?.name || "";
  const authorName = initialAuthor?.displayName || "Current User";
  const dateISO =
    initialPublishedAt || initialCreatedAt || new Date().toISOString();

  /* --------------------------- render --------------------------- */
  return (
    <Page>
      <Row type="horizontal">
        <Heading as="h1">
          {mode === "edit" ? "Edit article" : "Create article"}
        </Heading>
        <ButtonGroup>
          <Button variation="secondary" onClick={() => navigate(-1)}>
            &larr; Back
          </Button>
          <Button
            variation="secondary"
            onClick={() => actions.togglePreview(true)}
            disabled={!hasContent}
          >
            Preview
          </Button>
          <Button onClick={submit("draft")}>
            {mode === "edit" ? "Save changes" : "Save draft"}
          </Button>
          {step === 3 && mode !== "edit" && (
            <Button variation="primary" onClick={submit("submit")}>
              Submit for review
            </Button>
          )}
        </ButtonGroup>
      </Row>

      <Stepper
        steps={["Write", "Details", "Review & submit"]}
        active={step - 1}
      />

      {/* Step 1 — write */}
      {step === 1 && (
        <Shell>
          <Ribbon>
            <div style={{ fontWeight: 700, color: "var(--color-grey-700)" }}>
              Writing mode
            </div>
            <Button
              variation="primary"
              disabled={!canNextFromWrite}
              onClick={() => actions.stepTo(2)}
            >
              Next: Details →
            </Button>
          </Ribbon>

          <Card>
            <WordPage>
              <TitleInput
                id="title"
                placeholder="Start with a clear, specific title…"
                value={title}
                onChange={(e) => actions.set("title", e.target.value)}
                aria-label="Article title"
              />

              <BlockEditor value={blocks} onChange={actions.setBlocks} />

              <p
                style={{
                  margin: "10px 0 0",
                  fontSize: 12,
                  color: "var(--color-grey-600)",
                }}
              >
                Shortcuts: <kbd>Cmd/Ctrl</kbd>+<kbd>S</kbd> save •{" "}
                <kbd>Cmd/Ctrl</kbd>+<kbd>Enter</kbd> submit •{" "}
                <kbd>Cmd/Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> preview
              </p>
            </WordPage>
          </Card>
        </Shell>
      )}

      {/* Step 2 — details */}
      {step === 2 && (
        <Shell>
          <Ribbon>
            <div style={{ fontWeight: 700, color: "var(--color-grey-700)" }}>
              Fill in details
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button variation="secondary" onClick={() => actions.stepTo(1)}>
                &larr; Back to writing
              </Button>
              <Button variation="primary" onClick={() => actions.stepTo(3)}>
                {mode === "edit" ? "Review" : "Next: Review →"}
              </Button>
            </div>
          </Ribbon>

          <Card>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                actions.stepTo(3);
              }}
            >
              <FieldSlug
                value={slug}
                onChange={actions.setSlug}
                lock={lockSlug}
                onToggleLock={actions.toggleLock}
                url={`${window.location.origin}/articles/${slug || ""}`}
              />

              <FormRow label="Excerpt" controlId="excerpt">
                <Textarea
                  id="excerpt"
                  placeholder="One short paragraph (appears in cards & previews)"
                  value={excerpt}
                  onChange={(e) => actions.set("excerpt", e.target.value)}
                  rows={3}
                />
              </FormRow>

              <FormRow label="Publish credit" controlId="publishCredit">
                <Select
                  id="publishCredit"
                  value={publishCredit}
                  onChange={(e) => actions.set("publishCredit", e.target.value)}
                  options={CREDIT.map((c) => ({ value: c, label: c }))}
                />
              </FormRow>

              <FormRow label="Team" controlId="team">
                <Select
                  id="team"
                  value={teamId}
                  onChange={(e) =>
                    actions.set("teamId", Number(e.target.value))
                  }
                  options={TEAMS.map((t) => ({ value: t.id, label: t.name }))}
                />
              </FormRow>

              <FormRow label="Visibility" controlId="visibility">
                <Select
                  id="visibility"
                  value={visibility}
                  onChange={(e) => actions.set("visibility", e.target.value)}
                  options={VISIBILITY.map((v) => ({ value: v, label: v }))}
                />
              </FormRow>

              {visibility === "selected" && (
                <FormRow label="Selected user IDs" controlId="allowedUsers">
                  <Input
                    id="allowedUsers"
                    placeholder="uuid-1, uuid-2, uuid-3"
                    value={selectedUserIds}
                    onChange={(e) =>
                      actions.set("selectedUserIds", e.target.value)
                    }
                  />
                </FormRow>
              )}

              <FieldHero
                preview={heroPreview}
                onPick={actions.setHero}
                onClear={actions.clearHero}
                note="Pick a PNG/JPG; used in lists and article detail"
              />

              <FormRow label="Read time (min)" controlId="readTime">
                <Input
                  id="readTime"
                  type="number"
                  min={1}
                  value={readTimeMin}
                  onChange={(e) =>
                    actions.set("readTimeMin", Number(e.target.value))
                  }
                />
              </FormRow>

              <TagInput
                value={tags}
                onChange={(next) => actions.set("tags", next)}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "1.2rem",
                  paddingTop: "1.2rem",
                }}
              >
                <Button
                  variation="secondary"
                  type="button"
                  onClick={() => actions.stepTo(1)}
                >
                  &larr; Back
                </Button>
                <Button variation="primary" type="submit">
                  {mode === "edit" ? "Review" : "Next: Review →"}
                </Button>
              </div>
            </Form>
          </Card>
        </Shell>
      )}

      {/* Step 3 — review */}
      {step === 3 && (
        <Shell>
          <Ribbon>
            <div style={{ fontWeight: 700, color: "var(--color-grey-700)" }}>
              Review {mode === "edit" ? "& save" : "& submit"}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button variation="secondary" onClick={() => actions.stepTo(2)}>
                &larr; Back to details
              </Button>
              {mode === "edit" ? (
                <Button variation="primary" onClick={submit("draft")}>
                  Save changes
                </Button>
              ) : (
                <Button variation="primary" onClick={submit("submit")}>
                  Submit for review
                </Button>
              )}
            </div>
          </Ribbon>

          <Card>
            <WordPage>
              <AdminPreview
                blocks={blocks}
                meta={{
                  title,
                  excerpt,
                  tags,
                  teamName,
                  authorName,
                  publishCredit,
                  readTimeMin,
                  heroUrl: heroPreview || null,
                  heroAlt: "",
                  dateISO,
                  blogLabel: "IMALEX Blog",
                }}
              />
            </WordPage>
          </Card>
        </Shell>
      )}

      {/* Modal preview — same exact UI */}
      <Overlay open={showPreview} onClick={() => actions.togglePreview(false)}>
        <PreviewPanel onClick={(e) => e.stopPropagation()}>
          <Row type="horizontal">
            <Heading as="h2">Preview</Heading>
            <ButtonGroup>
              <Button
                variation="secondary"
                onClick={() => actions.togglePreview(false)}
              >
                Close
              </Button>
            </ButtonGroup>
          </Row>

          <WordPage>
            <AdminPreview
              blocks={blocks}
              meta={{
                title,
                excerpt,
                tags,
                teamName,
                authorName,
                publishCredit,
                readTimeMin,
                heroUrl: heroPreview || null,
                heroAlt: "",
                dateISO,
                blogLabel: "IMALEX Blog",
              }}
            />
          </WordPage>
        </PreviewPanel>
      </Overlay>
    </Page>
  );
}
