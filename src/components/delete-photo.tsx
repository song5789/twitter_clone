import styled from "styled-components";
import { useState } from "react";
import { db, storage } from "../firebase";
import { deleteObject, ref } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

interface PhotoLink {
  photoLink: string;
  userId: string;
  id: string;
}

const Wrapper = styled.div`
  position: relative;
`;
const DelPhoto = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;
const DeleteButton = styled.div`
  position: absolute;
  width: 25px;
  height: 25px;
  background-color: white;
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;

  left: 80%;
  top: 1%;
  svg {
    color: tomato;
  }

  &:hover {
    transform: scale(1.2);
  }
`;

export default function DeletePhoto({ photoLink, userId, id }: PhotoLink) {
  const [isDelete, setIsDelete] = useState(false);
  const onDeletePhoto = async () => {
    try {
      const photoRef = ref(storage, `tweets/${userId}/${id}`);
      await deleteObject(photoRef);
      const docRef = await doc(db, "tweets", id);
      await updateDoc(docRef, {
        photo: null,
      });
      setIsDelete(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Wrapper>
      {isDelete ? <h4>이미지 삭제</h4> : <DelPhoto src={photoLink} />}
      {isDelete ? null : (
        <DeleteButton onClick={onDeletePhoto}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
          </svg>
        </DeleteButton>
      )}
    </Wrapper>
  );
}
