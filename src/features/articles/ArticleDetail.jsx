// src/features/articles/ArticleDetail.jsx
import styled from "styled-components";
import { format, formatDistanceToNowStrict } from "date-fns";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Tag from "../../ui/Tag";
import Empty from "../../ui/Empty";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import {
  HiOutlineArrowTopRightOnSquare,
  HiOutlineClipboard,
  HiOutlineLink,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlinePaperAirplane,
  HiOutlineArrowUpOnSquare,
  HiOutlineArrowDownOnSquare,
  HiOutlinePencilSquare,
  HiOutlineTag,
  HiOutlineArrowLeft,
  HiOutlineDocumentText,
  HiOutlineEye,
  HiOutlineInformationCircle,
  HiOutlineShare,
} from "react-icons/hi2";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useArticle } from "./useArticle";

/* =================== tokens =================== */
const statusColor = {
  draft: "silver",
  in_review: "blue",
  changes_requested: "yellow",
  approved: "indigo",
  published: "green",
  unpublished: "silver",
  archived: "grey",
};

// Unsplash fallback hero (neutral lab/green)
const DEFAULT_HERO_URL =
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1920&q=80";

/* =================== styled (vars only) =================== */
const PageWrap = styled.div`
  --pad: clamp(14px, 2vw, 22px);
`;

const Banner = styled.header`
  position: relative;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  aspect-ratio: 16 / 5;
  min-height: 260px;
  background: linear-gradient(
    180deg,
    var(--color-grey-50),
    var(--color-grey-0)
  );
  border: 1px solid var(--color-grey-100);
  box-shadow: var(--shadow-sm);
`;

const BannerImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${(p) => (p.$loaded ? 1 : 0)};
  transition: opacity 0.35s ease-in-out;
`;

const BannerShade = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.28) 40%,
    rgba(0, 0, 0, 0.14) 75%,
    rgba(0, 0, 0, 0) 100%
  );
`;

const BannerContent = styled.div`
  position: absolute;
  inset: auto var(--pad) var(--pad) var(--pad);
  color: var(--color-brand-50);
  display: grid;
  gap: 10px;
`;

const Title = styled(Heading)`
  margin: 0;
  line-height: 1.05;
  letter-spacing: -0.01em;
  font-size: clamp(26px, 3.2vw + 14px, 52px);
  overflow-wrap: anywhere;
  word-break: break-word;
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.35), 0 1px 4px rgba(0, 0, 0, 0.6);
  @supports (text-wrap: balance) {
    text-wrap: balance;
  }
`;

const ChipRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const ChipGhost = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.4rem 1.2rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.5);
  color: var(--color-brand-50);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.2px;
  .ico {
    width: 14px;
    height: 14px;
    opacity: 0.95;
  }
`;

/* — plain, non-sticky actions bar — */
const ActionsBar = styled.div`
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid var(--color-grey-100);
`;

/* ---- Status banner ---- */
const StatusBanner = styled.div`
  margin-top: 14px;
  padding: 16px 18px;
  border: 1px solid var(--color-grey-100);
  background: linear-gradient(
    180deg,
    var(--color-grey-50),
    var(--color-grey-0)
  );
  border-radius: var(--border-radius-md);
  display: grid;
  gap: 10px;
  box-shadow: var(--shadow-sm);
  p {
    margin: 0;
    color: var(--color-grey-700);
  }
  .row {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
  }
`;

/* ---- Grid & surfaces ---- */
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 16px;
  @media (min-width: 1020px) {
    grid-template-columns: 1.08fr 0.92fr;
  }
`;

const Surface = styled.section`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-lg);
  padding: 1.8rem;
  box-shadow: var(--shadow-md);
`;

const SectionLabel = styled.h3`
  margin: 0 0 12px;
  color: var(--color-grey-500);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.6px;
`;

const MetaList = styled.dl`
  margin: 0;
`;
const RowLine = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1.2rem;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px dashed var(--color-grey-100);
`;
const Dt = styled.dt`
  color: var(--color-grey-500);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
`;
const Dd = styled.dd`
  margin: 0;
  color: var(--color-grey-700);
`;

const TagList = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;
const TagPill = styled.span`
  background: var(--color-grey-100);
  color: var(--color-grey-700);
  padding: 0.4rem 1.2rem;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const SideCard = styled.article`
  background: linear-gradient(
    180deg,
    var(--color-grey-50),
    var(--color-grey-0)
  );
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 1.4rem;
`;

const Timeline = styled.ul`
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
  display: grid;
  gap: 8px;
  li {
    display: grid;
    grid-template-columns: 18px 1fr;
    gap: 8px;
    align-items: center;
    color: var(--color-grey-600);
    font-size: 12.5px;
  }
  .ico {
    width: 16px;
    height: 16px;
    color: var(--color-grey-500);
  }
`;

const SlugBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
`;

const CodeMono = styled.code`
  background: var(--color-grey-100);
  color: var(--color-grey-700);
  padding: 8px 12px;
  border-radius: var(--border-radius-sm);
  font-size: 12px;
`;

/* ---- Reader card preview ---- */
const CardPreview = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
  align-items: center;
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-sm);
  padding: 12px;
  background: var(--color-grey-0);
  img {
    width: 120px;
    height: 80px;
    object-fit: cover;
    border-radius: var(--border-radius-sm);
  }
  h4 {
    margin: 0 0 4px 0;
    font-size: 14px;
    color: var(--color-grey-800);
  }
  p {
    margin: 0;
    font-size: 12px;
    color: var(--color-grey-600);
  }
`;

/* ---- Footer, bottom-right actions ---- */
const FooterActions = styled.div`
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

/* ---- Toast ---- */
const Toast = styled.div`
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-grey-800);
  color: var(--color-grey-0);
  padding: 10px 14px;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-lg);
  font-size: 13px;
  z-index: 60;
`;

/* helpers */
const fmt = (iso) => (iso ? format(new Date(iso), "PPP p") : "—");
const rel = (iso) =>
  iso ? formatDistanceToNowStrict(new Date(iso), { addSuffix: true }) : "";
const Line = ({ label, children }) => (
  <RowLine>
    <Dt>{label}</Dt>
    <Dd>{children ?? "—"}</Dd>
  </RowLine>
);

/* human copy per status */
const STATUS_COPY = {
  draft: {
    heading: "This article is a draft",
    blurb:
      "Only your team in the admin can see it. When it’s ready, submit for review or publish.",
    primary: { label: "Submit for review", intent: "submit" },
    secondary: { label: "Publish now", intent: "publish" },
  },
  in_review: {
    heading: "Waiting for review",
    blurb:
      "A reviewer will check content and details. You can still edit if needed.",
    primary: { label: "Edit article", intent: "edit" },
  },
  changes_requested: {
    heading: "Changes requested",
    blurb:
      "A reviewer asked for changes. Open the editor to address the notes and resubmit.",
    primary: { label: "Open editor", intent: "edit" },
  },
  approved: {
    heading: "Approved",
    blurb: "Looks good! You can publish when you’re ready.",
    primary: { label: "Publish", intent: "publish" },
  },
  published: {
    heading: "Live on the site",
    blurb:
      "This article is visible to readers. You can share the link or unpublish anytime.",
    primary: { label: "Open public page", intent: "open" },
    secondary: { label: "Unpublish", intent: "unpublish" },
  },
  unpublished: {
    heading: "Unpublished",
    blurb: "It’s hidden from readers. You can publish it again later.",
    primary: { label: "Publish again", intent: "publish" },
  },
  archived: {
    heading: "Archived",
    blurb: "This article is archived. Restore or duplicate if needed.",
    primary: { label: "Edit article", intent: "edit" },
  },
};

/* =================== main =================== */
export default function ArticleDetail() {
  const { articleId } = useParams();
  const { article } = useArticle(articleId);
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [toast, setToast] = useState("");

  // normalize
  const heroUrl = (article.hero?.url ?? article.heroUrl) || DEFAULT_HERO_URL;
  const heroAlt = article.hero?.alt ?? article.title ?? "";
  const publicLink =
    article.slug && article.status === "published" ? `/${article.slug}` : null;
  const absolutePublicUrl = publicLink
    ? `${window.location.origin}${publicLink}`
    : null;

  const statusCopy = STATUS_COPY[article.status] || STATUS_COPY.draft;
  const canPublish = article.status !== "published";
  const canUnpublish = article.status === "published";

  const copy = async (text, msg) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast(msg || "Copied!");
      setTimeout(() => setToast(""), 1600);
    } catch {
      setToast("Could not copy");
      setTimeout(() => setToast(""), 1600);
    }
  };

  // shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
      const k = e.key.toLowerCase();
      if (k === "b") navigate(-1);
      if (k === "e") navigate(`/articles/${article.id}/edit`);
      if (k === "p" && article.status !== "published")
        setToast("(static) Publish");
      if (k === "u" && article.status === "published")
        setToast("(static) Unpublish");
      if (k === "s" && absolutePublicUrl)
        copy(absolutePublicUrl, "Public URL copied");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, article.id, article.status, absolutePublicUrl]);

  const whoSees = useMemo(() => {
    switch (article.visibility) {
      case "public":
        return "Everyone";
      case "team":
        return "Your organization";
      case "selected":
        return "Only selected people";
      case "private":
        return "Only you";
      default:
        return article.visibility;
    }
  }, [article.visibility]);

  const handleStatusPrimary = () => {
    const intent = statusCopy.primary?.intent;
    if (!intent) return;
    if (intent === "open" && publicLink)
      window.open(publicLink, "_blank", "noopener,noreferrer");
    else if (intent === "edit") navigate(`/articles/${article.id}/edit`);
    else if (intent === "publish") setToast("(static) Publish");
    else if (intent === "unpublish") setToast("(static) Unpublish");
    else if (intent === "submit") setToast("(static) Submit for review");
  };
  if (!article) return <Empty resourceName="article" />;

  return (
    <PageWrap>
      {/* Banner */}
      <Banner>
        <BannerImg
          src={heroUrl}
          alt={heroAlt}
          loading="eager"
          decoding="async"
          $loaded={imgLoaded}
          onLoad={() => setImgLoaded(true)}
        />
        <BannerShade />
        <BannerContent>
          <Title as="h1" title={article.title}>
            {article.title}
          </Title>
          <ChipRow>
            <Tag type={statusColor[article.status] || "silver"}>
              {article.status.replace("_", " ")}
            </Tag>
            <ChipGhost title="Who can see this">
              <HiOutlineLink className="ico" /> {whoSees}
            </ChipGhost>
            {article.readTimeMin ? (
              <ChipGhost title="Estimated read time">
                <HiOutlineClock className="ico" /> {article.readTimeMin} min
                read
              </ChipGhost>
            ) : null}
          </ChipRow>
        </BannerContent>
      </Banner>

      {/* Regular actions (top utility) */}
      <ActionsBar>
        <ButtonText onClick={() => navigate(-1)} aria-label="Go back">
          <HiOutlineArrowLeft /> Back
        </ButtonText>

        <ButtonGroup>
          <Button
            variation="secondary"
            size="small"
            disabled={!article.slug}
            onClick={() => copy(`/${article.slug}`, "URL path copied")}
          >
            <HiOutlineClipboard /> Copy URL path
          </Button>
          <Button
            variation="secondary"
            size="small"
            onClick={() => copy(article.id, "ID copied")}
          >
            <HiOutlineClipboard /> Copy ID
          </Button>

          {absolutePublicUrl && (
            <>
              <Button size="small">
                {" "}
                <a href={publicLink} target="_blank" rel="noreferrer">
                  <HiOutlineArrowTopRightOnSquare /> Open public page
                </a>
              </Button>

              <Button
                variation="secondary"
                size="small"
                onClick={() => copy(absolutePublicUrl, "Public URL copied")}
              >
                <HiOutlineShare /> Share link
              </Button>
            </>
          )}
        </ButtonGroup>
      </ActionsBar>

      {/* Status helper */}
      <StatusBanner role="status" aria-live="polite">
        <div
          className="row"
          style={{ color: "var(--color-grey-800)", fontWeight: 700 }}
        >
          <HiOutlineInformationCircle style={{ opacity: 0.8 }} />
          {statusCopy.heading}
        </div>
        <p>{statusCopy.blurb}</p>
        <div className="row">
          {statusCopy.primary && (
            <Button onClick={handleStatusPrimary}>
              {statusCopy.primary.label}
            </Button>
          )}
          {statusCopy.secondary && (
            <Button
              variation="secondary"
              onClick={() => setToast(`(static) ${statusCopy.secondary.label}`)}
            >
              {statusCopy.secondary.label}
            </Button>
          )}
        </div>
      </StatusBanner>

      {/* Content */}
      <Grid>
        {/* LEFT: meta */}
        <Surface aria-label="Article information">
          <SectionLabel>
            <HiOutlineDocumentText style={{ marginRight: 6, opacity: 0.8 }} />
            Details
          </SectionLabel>

          <SlugBar>
            <CodeMono>
              {article.slug ? `/${article.slug}` : "No URL yet"}
            </CodeMono>
            {!article.slug && (
              <span style={{ color: "var(--color-grey-500)", fontSize: 12 }}>
                Set a URL in the editor → Details step
              </span>
            )}
          </SlugBar>

          <MetaList>
            <Line label="Who can see this">{whoSees}</Line>
            <Line label="Credit shown to readers">
              {article.publishCredit === "team"
                ? article.team?.name || "—"
                : article.author?.displayName || "—"}
            </Line>
            <Line label="Team">{article.team?.name || "—"}</Line>
            <Line label="Author">{article.author?.displayName || "—"}</Line>
            <Line label="Topics">
              {article.tags?.length ? (
                <TagList>
                  {article.tags.map((t) => (
                    <TagPill key={t}>
                      <HiOutlineTag style={{ opacity: 0.8 }} /> {t}
                    </TagPill>
                  ))}
                </TagList>
              ) : (
                "—"
              )}
            </Line>

            <Line label="Created">
              {article.createdAt ? (
                <>
                  {fmt(article.createdAt)}{" "}
                  <span style={{ color: "var(--color-grey-500)" }}>
                    ({rel(article.createdAt)})
                  </span>
                </>
              ) : (
                "—"
              )}
            </Line>

            {article.submittedAt && (
              <Line label="Submitted for review">
                {fmt(article.submittedAt)}{" "}
                <span style={{ color: "var(--color-grey-500)" }}>
                  ({rel(article.submittedAt)})
                </span>
              </Line>
            )}

            {article.publishedAt && (
              <Line label="Published">
                {fmt(article.publishedAt)}{" "}
                <span style={{ color: "var(--color-grey-500)" }}>
                  ({rel(article.publishedAt)})
                </span>
              </Line>
            )}

            {article.unpublishedAt && (
              <Line label="Unpublished">
                {fmt(article.unpublishedAt)}{" "}
                <span style={{ color: "var(--color-grey-500)" }}>
                  ({rel(article.unpublishedAt)})
                </span>
              </Line>
            )}

            {article.updatedAt && (
              <Line label="Last updated">
                {fmt(article.updatedAt)}{" "}
                <span style={{ color: "var(--color-grey-500)" }}>
                  ({rel(article.updatedAt)})
                </span>
              </Line>
            )}

            <SectionLabel style={{ marginTop: 14 }}>
              <HiOutlineEye style={{ marginRight: 6, opacity: 0.8 }} />
              Status timeline
            </SectionLabel>
            <Timeline>
              <li title="Created">
                <HiOutlineClock className="ico" />
                <span>
                  Created • {fmt(article.createdAt)}{" "}
                  <span style={{ color: "var(--color-grey-500)" }}>
                    {rel(article.createdAt)}
                  </span>
                </span>
              </li>
              {article.submittedAt && (
                <li title="Submitted for review">
                  <HiOutlinePaperAirplane className="ico" />
                  <span>
                    Submitted • {fmt(article.submittedAt)}{" "}
                    <span style={{ color: "var(--color-grey-500)" }}>
                      {rel(article.submittedAt)}
                    </span>
                  </span>
                </li>
              )}
              {article.publishedAt && (
                <li title="Published">
                  <HiOutlineCheckCircle className="ico" />
                  <span>
                    Published • {fmt(article.publishedAt)}{" "}
                    <span style={{ color: "var(--color-grey-500)" }}>
                      {rel(article.publishedAt)}
                    </span>
                  </span>
                </li>
              )}
            </Timeline>
          </MetaList>
        </Surface>

        {/* RIGHT: reader preview */}
        <SideCard aria-label="What readers see">
          <SectionLabel>What readers see</SectionLabel>
          <CardPreview>
            <img src={heroUrl} alt="" />
            <div>
              <h4>{article.title}</h4>
              <p>
                {article.excerpt ||
                  article.bodyPreview ||
                  "Short description appears here."}
              </p>
            </div>
          </CardPreview>

          <SectionLabel style={{ marginTop: 14 }}>Preview text</SectionLabel>
          <p style={{ marginTop: 0, marginBottom: 14 }}>
            {article.bodyPreview || "—"}
          </p>

          <SectionLabel>Excerpt (used in lists)</SectionLabel>
          <p style={{ marginTop: 0 }}>{article.excerpt || "—"}</p>
        </SideCard>
      </Grid>

      {/* Bottom-right primary actions */}
      <FooterActions>
        <Button onClick={() => navigate(`/articles/${article.id}/edit`)}>
          <HiOutlinePencilSquare /> Edit
        </Button>

        {canPublish && (
          <Button
            onClick={() => {
              setToast("(static) Publish");
              setTimeout(() => setToast(""), 1600);
            }}
          >
            <HiOutlineArrowUpOnSquare /> Publish
          </Button>
        )}
        {canUnpublish && (
          <Button
            onClick={() => {
              setToast("(static) Unpublish");
              setTimeout(() => setToast(""), 1600);
            }}
          >
            <HiOutlineArrowDownOnSquare /> Unpublish
          </Button>
        )}

        <Modal>
          <Modal.Open opens="delete">
            <Button variation="danger">Delete</Button>
          </Modal.Open>
          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="article"
              onConfirm={() => {
                setToast(`(static) Delete id=${article.id}`);
                setTimeout(() => setToast(""), 1600);
              }}
            />
          </Modal.Window>
        </Modal>
      </FooterActions>

      {/* toast */}
      {toast && (
        <Toast role="status" aria-live="polite">
          {toast}
        </Toast>
      )}
    </PageWrap>
  );
}
