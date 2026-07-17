import { Link } from "react-router-dom";
import styled from "styled-components";

export default function Header() {
  return (
    <HeaderContainer>
      <LogoTitle>
        <LogoLink to="/">FlixDrop</LogoLink>
      </LogoTitle>

      <NavMenu style={{ display: "flex", gap: "20px" }}>
        <MenuLink to="/">홈</MenuLink>
        <MenuLink to="history">보관함</MenuLink>
      </NavMenu>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.header`
  background-color: #141414;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #252525;
  font-family: "Noto Sans KR", sans-serif;
`;

const LogoTitle = styled.h1`
  margin: 0;
  font-size: 26px;
  font-weight: 900;
  letter-spacing: -1px;
`;

const LogoLink = styled(Link)`
  color: #e50914;
  text-decoration: none;
  span {
    color: #ffffff;
  }
`;

const NavMenu = styled.nav`
  display: flex;
  gap: 20px;
`;

const MenuLink = styled(Link)`
  color: #e5e5e5;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: #e50914;
  }
`;
