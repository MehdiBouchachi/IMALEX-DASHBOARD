// src/features/navigation/MainNav.jsx
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineHome,
  HiOutlineClipboardDocumentList,
  HiOutlineNewspaper,
  HiOutlineIdentification,
  HiOutlineUsers,
  HiOutlineCog6Tooth,
} from "react-icons/hi2";

/* ---------- UI ---------- */
const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const SectionLabel = styled.div`
  margin: 1.6rem 0 0.4rem;
  padding: 0 2.4rem;
  font-size: 1.1rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-grey-400);
`;

const StyledNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    justify-content: space-between; /* keeps badge aligned */
    gap: 1.2rem;

    color: var(--color-grey-600);
    font-size: 1.6rem;
    font-weight: 500;
    padding: 1.2rem 2.4rem;
    transition: all 0.3s;
    border-radius: var(--border-radius-sm);
  }

  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-grey-800);
    background-color: var(--color-grey-50);
  }

  & .nav-item {
    display: inline-flex;
    align-items: center;
    gap: 1.2rem;
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-brand-600);
  }
`;

const Badge = styled.span`
  min-width: 2.4rem;
  height: 2rem;
  padding: 0 0.6rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-brand-700);
  background: rgba(16, 185, 129, 0.12); /* subtle brand-ish tint */
  border: 1px solid rgba(16, 185, 129, 0.2);
`;

/* ---------- Config ---------- */
const navGroups = [
  {
    label: "Overview",
    items: [{ to: "/dashboard", label: "Home", icon: HiOutlineHome }],
  },
  {
    label: "CRM",
    items: [
      /*  { to: "/clients", label: "Clients", icon: HiOutlineUserGroup }, */
      // Pipeline for requests/briefs with statuses: in_study, in_progress, accepted, complete
      {
        to: "/briefs",
        label: "Briefs",
        icon: HiOutlineClipboardDocumentList,
        showBadge: true,
      },
    ],
  },
  /*  {
    label: "R&D",
    items: [
      { to: "/formulations", label: "Formulations", icon: HiOutlineBeaker },
      // If later: { to: "/studies", label: "Studies", icon: HiOutlineBeaker },
    ],
  }, */
  {
    label: "Content",
    items: [{ to: "/articles", label: "Articles", icon: HiOutlineNewspaper }],
  },
  {
    label: "People",
    items: [
      { to: "/profiles", label: "Profiles", icon: HiOutlineIdentification }, // unified profiles (users & clients)
      { to: "/users", label: "Users", icon: HiOutlineUsers },
    ],
  },
  {
    label: "System",
    items: [{ to: "/settings", label: "Settings", icon: HiOutlineCog6Tooth }],
  },
];

/* ---------- Component ---------- */
function MainNav({ openBriefsCount = 0 }) {
  return (
    <nav>
      {navGroups.map((group) => (
        <div key={group.label}>
          <SectionLabel>{group.label}</SectionLabel>
          <NavList>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <StyledNavLink to={item.to}>
                    <span className="nav-item">
                      <Icon />
                      <span>{item.label}</span>
                    </span>
                    {item.showBadge && openBriefsCount > 0 ? (
                      <Badge aria-label={`${openBriefsCount} open briefs`}>
                        {openBriefsCount}
                      </Badge>
                    ) : null}
                  </StyledNavLink>
                </li>
              );
            })}
          </NavList>
        </div>
      ))}
    </nav>
  );
}

export default MainNav;
