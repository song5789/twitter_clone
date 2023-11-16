import styled from "styled-components";

export const Wrapper = styled.div`
  height: 100%;
  width: 420px;
  min-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0px;
`;

export const Title = styled.h1`
  font-size: 42px;
`;

export const Form = styled.form`
  margin-top: 50px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;

  &[type="submit"] {
    cursor: pointer;
    background-color: #1d9bf0;
    color: white;
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

export const Switcher = styled.span`
  margin-top: 10px;
  a {
    color: #1d9bf0;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
`;

export const OrLine = styled.span`
  text-align: center;
  color: #a8a8a8;
  width: 100%;
  height: 20px;
  margin: 25px 0;
`;
