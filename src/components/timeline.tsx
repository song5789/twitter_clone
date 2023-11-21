import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";

/* 사용할 데이터의 형식을 지정. 서버에서 불러온 데이터를 
 지정한 인터페이스에 맞게 가공할것임.*/
export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createAt: number;
  updateAt?: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
`;

export default function Timeline() {
  // 상태 tweets 는  ITweet 타입인 요소만 들어올 수 있는 배열임
  const [tweets, setTweets] = useState<ITweet[]>([]);

  // useEffect 로 컴포넌트 최초 렌더링시 트윗을 불러옴.
  useEffect(() => {
    /* unsubscribe 는 추후 사용자가 Timeline 컴포넌트를
       보고있지 않을 때, 서버에서 변경점이 있을경우 계속 
       값을 요청하지 않기 위해 쓸것임. (최적화, 비용 절감)
    */
    let unsubscribe: Unsubscribe | null = null;
    // 실제 서버에서 데이터를 요청하는 함수
    const fetchTweets = async () => {
      /* 
        서버에 쿼리를 날리기위해 쿼리를 만듬.
        db 의 "tweets" 컬렉션에서 작성 시간을 내림차순으로, 
        최대 25개까지만 불러오도록 설정.
      */
      const tweetsQuery = query(collection(db, "tweets"), orderBy("createAt", "desc"), limit(25));
      /*const snapshot = await getDocs(tweetsQuery);
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createAt, userId, username, photo } = doc.data();
          return {
            tweet,
            createAt,
            userId,
            username,
            photo,
            id: doc.id,
          }; <- getDocs로 요청할 수 있으나, 실시간으로 반응하지 않음.
        });*/

      /* 
           onSnapshot 은 특정 문서, 컬렉션 등에서 발생하는 쿼리이벤트를 
           감지하여 실시간으로 콜백함수를 실행함. 
           실시간으로 db 의 변동사항을 화면에 반영할 수 있게됨. 

           onSnapshot 은 unsubscribe 를 반환함. 위에 선언한 변수에 할당했음.
           onSnapshot(Query, callback)
        */
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        // snapshot.docs 에 쿼리로 요청한 값이 있음. 배열이기에 map으로 데이터를 가공하여 새로운 배열을 만듬
        const tweets = snapshot.docs.map((doc) => {
          /* 
          .docs 자체를 사용하려하면 안됨. 내부 요소는 QueryDocumentSnapshot 로 감싸져있음. 
          .data()는 실제 데이터를 추출하는 메소드인듯함.
          */
          const { tweet, createAt, userId, username, photo, updateAt } = doc.data();
          // 객체로 만들어 반환, 배열은 아래의 형태를 가진 객체들로 이뤄질것.
          return {
            tweet,
            createAt,
            userId,
            username,
            photo,
            id: doc.id,
            updateAt: updateAt || null,
            // doc.id 는 문서의 고유 id, userId 와는 다름.
          };
        });
        // 위에서 만든 배열을 상태에 반영.
        setTweets(tweets);
      });
    };
    // 서버 요청 함수 실행
    fetchTweets();
    // 컴포넌트가 언마운트 됐을 시 동작 정의.
    return () => {
      // onSnapshot 이 실행되며 unsubscribe 에 함수가 할당됐다면 해당 함수를 실행하여 언마운트 됐을 시 이벤트 추적을 끝냄.
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Wrapper>
      {/* 배열을 렌더링 */}
      {tweets.map((tweet) => (
        // Tweet 컴포넌트에 tweet의 값들을 스프레드 문법으로 넘김
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
