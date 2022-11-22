import styles from '@/styles/corapura/components/detailComment.module.scss'
import corapura from '@/images/corapura/companyDetail/cont5_title.svg'
import Link from 'next/link';
import dummy from '@/images/corapura/common/userDummy.svg'
import { useCallback, useState } from 'react';
import { Btn } from '@/components/corapura';

const DetailComment = ({comments}) => {
  const [more, setMore] = useState(false)
  const [comment, setComment] = useState(comments.filter((comment, index) => {
    return index < 5
  }))

  const handleClickMore = useCallback(async () => {
    setMore(true)
    setComment(comments)
  }, [setMore, setComment])

  return (
    <div className={styles.commentBox}>
      <div className={styles.ttl}>
        <img src={corapura.src} alt="コラプラ" />
        した企業・ユーザーからのコメント一覧
      </div>
      <p className={styles.count}>コメント：<span>{comments.length}</span>件</p>
      <ul className={styles.list}>
        {comment.map((comment, index) => (
          <li className={styles.item} key={index}>
            <Link href={`/corapura/${comment.user.account_type === 0 ? "influencer" : "company"}/${comment.user.c_profile_id}`}>
              <a className={styles.profile}>
                <div className={styles.iconBox}>
                  <img src={comment.user.c_profile.thumbs ? comment.user.c_profile.thumbs : dummy.src} alt="" />
                </div>
                {comment.user.c_profile.nicename}
              </a>
            </Link>
            <p className={styles.txt}>{comment.content}</p>
          </li>
        ))}
      </ul>
      {!more && comments.length > 5 ?
        <div className="btnCover" onClick={handleClickMore}>
          <Btn txt="さらに見る" />
        </div>
      : null}
    </div>
  );
}

export default DetailComment;