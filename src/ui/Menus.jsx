// src/ui/Menus.jsx
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";
import useOutSideClick from "../hooks/useOutSideClick";

/* ────────────────────────────────────────────────────────────── */
/* Config */
const GUTTER = 8; // spacing from trigger
const MENU_MIN_W = 200; // px
const MENU_MAX_W = 280; // px
const MENU_MAX_H_FRAC = 0.6; // fraction of viewport height
const EVT_CLOSE_ALL = "__MENUS_CLOSE_ALL__"; // global close event

/* ────────────────────────────────────────────────────────────── */
/* UI */
const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul`
  position: fixed; /* anchored to viewport; we recompute on scroll/resize */
  z-index: 1000;
  left: ${(p) => p.pos.left}px;
  top: ${(p) => p.pos.top}px;

  min-width: ${MENU_MIN_W}px;
  max-width: ${MENU_MAX_W}px;
  max-height: ${(/*p*/) => Math.round(window.innerHeight * MENU_MAX_H_FRAC)}px;
  overflow: auto; /* menu itself can scroll */
  overscroll-behavior: contain;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  gap: 1.6rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
  }
`;

/* ────────────────────────────────────────────────────────────── */
/* State / Context */
const MenuCtx = createContext(null);

function Menus({ children }) {
  const [openId, setOpenId] = useState("");
  const [anchorEl, setAnchorEl] = useState(null); // DOM node of the toggle
  const [pos, setPos] = useState({ left: 0, top: 0 });

  const close = () => setOpenId("");
  const open = setOpenId;

  // Listen for global "close all" events so only one menu can be open app-wide
  useEffect(() => {
    const onCloseAll = () => setOpenId("");
    window.addEventListener(EVT_CLOSE_ALL, onCloseAll);
    return () => window.removeEventListener(EVT_CLOSE_ALL, onCloseAll);
  }, []);

  // Recompute a BASE position (below the button) on scroll/resize while open.
  useEffect(() => {
    if (!openId || !anchorEl) return;

    const updateBasePos = () => {
      const rect = anchorEl.getBoundingClientRect();
      const vw = window.innerWidth;

      // Base position: below toggle, clamped horizontally.
      let left = Math.round(Math.min(rect.left, vw - MENU_MAX_W - GUTTER));
      if (left < GUTTER) left = GUTTER;

      const top = Math.round(rect.bottom + GUTTER); // always start below
      setPos({ left, top });
    };

    updateBasePos();
    window.addEventListener("scroll", updateBasePos, true);
    window.addEventListener("resize", updateBasePos);
    return () => {
      window.removeEventListener("scroll", updateBasePos, true);
      window.removeEventListener("resize", updateBasePos);
    };
  }, [openId, anchorEl]);

  return (
    <MenuCtx.Provider
      value={{ openId, open, close, anchorEl, setAnchorEl, pos, setPos }}
    >
      {children}
    </MenuCtx.Provider>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* Parts */
function Toggle({ id, children }) {
  const { openId, open, close, setAnchorEl } = useContext(MenuCtx);

  function handleClick(e) {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);

    if (openId === id) {
      // toggle off
      close();
    } else {
      // close ALL other menus first, then open this one
      window.dispatchEvent(new Event(EVT_CLOSE_ALL));
      open(id);
    }
  }

  return (
    <StyledToggle
      onClick={handleClick}
      aria-haspopup="menu"
      aria-expanded={openId === id}
      aria-controls={openId === id ? `menu-${id}` : undefined}
    >
      {children ?? <HiEllipsisVertical />}
    </StyledToggle>
  );
}

function List({ id, children }) {
  const { openId, close, pos, setPos, anchorEl } = useContext(MenuCtx);
  const ref = useOutSideClick(close, false);

  // After mount (and whenever base pos changes), measure and:
  // - keep below if it fits,
  // - otherwise NUDGE UP so the bottom stays inside viewport,
  // - or FLIP ABOVE the toggle if there’s enough room.
  useLayoutEffect(() => {
    if (openId !== id || !ref.current) return;

    const menuRect = ref.current.getBoundingClientRect();
    const btnRect = anchorEl?.getBoundingClientRect();
    if (!btnRect) return;

    const vh = window.innerHeight;
    const fitsBelow = pos.top + menuRect.height <= vh - GUTTER;

    let nextTop = pos.top;

    if (!fitsBelow) {
      const canFlip = btnRect.top - GUTTER - menuRect.height >= GUTTER; // full room above
      if (canFlip) {
        // Flip fully above
        nextTop = Math.max(
          GUTTER,
          Math.round(btnRect.top - GUTTER - menuRect.height)
        );
      } else {
        // Not enough space above either -> NUDGE so bottom rests at GUTTER
        nextTop = Math.max(GUTTER, vh - GUTTER - Math.round(menuRect.height));
      }
    }

    if (nextTop !== pos.top) setPos((p) => ({ ...p, top: nextTop }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openId, id, pos, anchorEl]);

  if (openId !== id) return null;

  return createPortal(
    <StyledList id={`menu-${id}`} role="menu" pos={pos} ref={ref}>
      {children}
    </StyledList>,
    document.body
  );
}

function Button({ onClick, children, icon }) {
  const { close } = useContext(MenuCtx);
  function handleClick() {
    onClick?.();
    close();
  }
  return (
    <li role="none">
      <StyledButton role="menuitem" onClick={handleClick}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

/* ────────────────────────────────────────────────────────────── */
Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
