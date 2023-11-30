import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";
import EditTweetForm from "./edit-tweet-form";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 5fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  width: 100% !important;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Row = styled.div`
  display: flex;
  gap: 10px;
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.div`
  font-weight: 600;
  font-size: 15px;
  display: flex;
  align-items: center;
`;

const Payload = styled.p`
  margin: 10px 0;
  font-size: 18px;
`;

const TweetButton = styled.button<{ color?: string }>`
  background-color: ${(props) => props.color || "tomato"};
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const Avatar = styled.div`
  width: 30px;
  overflow: hidden;
  height: 30px;
  border-radius: 50%;
  background-color: #1d9bf0;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;
const AvatarImg = styled.img`
  width: 100%;
`;

// props 는 객체로 넘어옴. 구조분해할당으로 필요한 값을 뽑아오자.
// 타입 지정으로 서버에서 넘어온값만 들어오도록 함.
export default function Tweet({ username, photo, tweet, userId, id, updateAt, userAvatar }: ITweet) {
  const [editToggle, setEditToggle] = useState(false);
  const user = auth.currentUser;
  const onDelete = async () => {
    const ok = confirm("해당 트윗을 삭제하시겠습니까?");
    if (user?.uid !== userId || !ok || !user) return;
    try {
      // deleteDoc(문서의 참조값), doc()에서 가져온 참조값을 토대로 해당 문서를 삭제.
      // doc() 에서 db, 삭제할 해당 컬렉션 과 삭제할 요소의 id 를 넘김
      await deleteDoc(doc(db, "tweets", id));
      // 만약 사진이 있다면
      if (photo) {
        // 사진의 참조값 가져오기 'tweets/userId/docId' 에 있음.
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        // deleteObject(Ref), 참조값을 넘겨받아 스토리지에서 해당 오브젝트 삭제.
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  };
  const onEditClicked = () => {
    setEditToggle(!editToggle);
  };

  return (
    <Wrapper>
      <Column>
        <Row>
          <Avatar>
            {userAvatar ? (
              <AvatarImg src={userAvatar} />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path
                  fillRule="evenodd"
                  d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </Avatar>
          <Username>
            {username} {updateAt ? " | (수정된 트윗)" : null}
          </Username>
        </Row>
        {editToggle ? <EditTweetForm tweet={tweet} userId={userId} id={id} photo={photo} setEditToggle={setEditToggle} /> : <Payload>{tweet}</Payload>}
        {/* 삭제는 현재 로그인된 유저와 트윗의 userId 가 같을 때만 가능 */}
        <Row>
          {user?.uid === userId ? <TweetButton onClick={onDelete}>Delete</TweetButton> : null}
          {user?.uid === userId ? (
            <TweetButton color="gray" onClick={onEditClicked}>
              {editToggle ? "Cancel" : "Edit"}
            </TweetButton>
          ) : null}
        </Row>
      </Column>
      {editToggle ? null : <Column>{photo ? <Photo src={photo} /> : null}</Column>}
    </Wrapper>
  );
}
