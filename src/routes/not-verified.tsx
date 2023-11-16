import { Link } from "react-router-dom";
import styled from "styled-components";
import { Switcher } from "../components/auth-components";
import { auth } from "../firebase";
import { sendEmailVerification } from "firebase/auth";

const Wrapper = styled.div`
  padding: 10% 0;
  height: 100%;
  width: 520px;
  min-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Message = styled.h1`
  font-size: 2.3rem;
  font-weight: 600;
  margin-bottom: 50px;
  text-align: center;
  line-height: 45px;
`;

const StyledLink = styled(Link)`
  width: 100%;
  padding: 10px 20px;
  background-color: #1d9bf0;
  border-radius: 50px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  color: white;
  text-decoration: none;

  &:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
`;

const Send = styled.span`
  cursor: pointer;
  color: #1d9bf0;

  &:hover {
    text-decoration: underline;
  }
`;

const sendEmail = async () => {
  const user = auth.currentUser!;
  try {
    await sendEmailVerification(user);
  } catch (error) {
    console.log(error);
  }
};

export default function NotVertified() {
  return (
    <Wrapper>
      <Message>Please proceed with email verification.</Message>
      <StyledLink to={"/"}>I have completed verification.</StyledLink>
      <Switcher>
        Didn't receive the email? <Send onClick={sendEmail}>Send again &rarr;</Send>
      </Switcher>
    </Wrapper>
  );
}
