import styled from "styled-components";

export const MAXW = "1280px";

export const Page = styled.div`
  background: var(--color-grey-50);
  min-height: 100%;
  padding: 2.4rem 1.4rem 6.4rem;
`;

export const Shell = styled.div`
  max-width: min(${MAXW}, 96vw);
  margin: 1.2rem auto 0;
`;

export const Ribbon = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
  padding: 1.2rem 1.4rem;
  margin: 0 0 1rem;
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
`;

export const Card = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  padding: clamp(12px, 2vw, 16px);
`;

export const WordPage = styled.div`
  width: min(960px, 100%);
  margin: 0 auto;
`;

export const TitleInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: var(--color-grey-900);
  font-weight: 800;
  letter-spacing: -0.01em;
  font-size: clamp(24px, 2.2vw + 16px, 44px);
  line-height: 1.15;
  margin: 0 0 1rem;
  overflow-wrap: anywhere;
`;
