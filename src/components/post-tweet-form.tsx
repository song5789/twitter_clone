import styled, { css } from "styled-components";
import { useState } from "react";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

  &::placeholder {
    font-size: 16px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label<{ error?: boolean }>`
  cursor: pointer;
  border-radius: 20px;
  padding: 10px 0px;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  color: #1d9bf0;
  border: 1px solid #1d9bf0;

  ${(props) =>
    props.error &&
    css`
      border-color: tomato;
      color: tomato;
    `}
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  cursor: pointer;
  border-radius: 20px;
  padding: 10px 0px;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  color: white;
  border: none;
  background-color: #1d9bf0;

  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function PostTweetForm() {
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState(false);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      if (files[0].size > 1024 * 1024) {
        setError(true);
        alert("1MB 이하의 사진만 업로드 가능합니다.");
        return;
      }
      setError(false);
      setFile(files[0]);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;

    try {
      setLoading(true);
      const doc = await addDoc(collection(db, "tweets"), {
        tweet,
        createAt: Date.now(),
        username: user.displayName || "Annoymous",
        userId: user.uid,
      });
      if (file) {
        const locationRef = ref(storage, `tweets/${user.uid}-${user.displayName}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          photo: url,
        });
      }
      setTweet("");
      setFile(null);
      setError(false);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <TextArea required rows={5} maxLength={180} onChange={onChange} value={tweet} placeholder="What is happning?!" />
      <AttachFileButton error={error} htmlFor="file">
        {file ? "Photo added ✅" : "Add Photo"}
      </AttachFileButton>
      <AttachFileInput onChange={onFileChange} type="file" id="file" accept="image/*" />
      <SubmitBtn type="submit" value={isLoading ? "Posting..." : "Post Tweet"} />
    </Form>
  );
}
