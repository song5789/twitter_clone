import styled from "styled-components";
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

const AttachFileButton = styled.label`
  cursor: pointer;
  border-radius: 20px;
  padding: 10px 0px;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  color: #1d9bf0;
  border: 1px solid #1d9bf0;
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

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      // 파일 ChangeEvent, 들어온 파일 사이즈가 1MB 이상이라면 경고를 띄우고 업로드를 중단함.
      if (files[0].size > 1024 * 1024) {
        alert("1MB 이하의 사진만 업로드 가능합니다.");
        return;
      }
      setFile(files[0]);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // 새로고침 방지
    e.preventDefault();
    // 현재 로그인된 유저정보를 불러옴.
    const user = auth.currentUser;
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;

    try {
      setLoading(true);
      // addDoc(collectionRef, data)
      // collection(firestore, path)
      const doc = await addDoc(collection(db, "tweets"), {
        tweet,
        createAt: Date.now(),
        username: user.displayName || "Annoymous",
        userId: user.uid,
        userAvatar: user.photoURL,
      });
      // 업로드된 파일이 있다면
      if (file) {
        // 저장 경로 지정.
        // ref(storage, url)
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
        // uploadBytes(storageRef, file), 실행 후 결과에 대한 Promise 를 반환.
        const result = await uploadBytes(locationRef, file);
        // getDownloadURL(ref), 반환된 결과에서 참조값을 받아 이미지 URL를 불러옴.
        const url = await getDownloadURL(result.ref);
        // updateDoc(docRef, data), 작성한 트윗에 이미지 URL 을 추가함.
        await updateDoc(doc, {
          photo: url,
        });
      }
      setTweet("");
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <TextArea required rows={5} maxLength={180} onChange={onChange} value={tweet} placeholder="What is happning?!" />
      <AttachFileButton htmlFor="file">{file ? "Photo added ✅" : "Add Photo"}</AttachFileButton>
      <AttachFileInput onChange={onFileChange} type="file" id="file" accept="image/*" />
      <SubmitBtn type="submit" value={isLoading ? "Posting..." : "Post Tweet"} />
    </Form>
  );
}
