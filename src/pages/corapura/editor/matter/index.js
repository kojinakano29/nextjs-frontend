import styles from '@/styles/corapura/components/editorList.module.scss'
import PageLayoutCorapura from "@/components/Layouts/pageLayoutCorapura";
import Container from '@/components/corapura/Layout/container';
import Link from 'next/link';
import plus from '@/images/corapura/common/plusW.svg'
import { useAuth } from '@/hooks/auth';
import { useCallback, useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { Date, Loader } from '@/components/corapura';
import dummy from '@/images/corapura/common/dummy1.svg'

const AdminMatterList = () => {
  const csrf = () => axios.get('/sanctum/csrf-cookie')

  const { user } = useAuth({middleware: 'auth', type: 'corapura'})
  const [disabled, setDisabled] = useState(false)
  const [matters, setMatters] = useState([])
  const [nowPage, setNowPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const [page, setPage] = useState(1)

  const handleSort = useCallback(async () => {
    await csrf()

    await axios.post(`/api/corapura/post/mypost`, {
      user_id: user?.id,
      page: parseInt(page),
    }).then((res) => {
      // console.log(res)
      setMatters(res.data.post)
      setNowPage(res.data.now_page)
      setMaxPage(res.data.page_max)
    }).catch(e => console.error(e))
  }, [
    setMatters,
    setNowPage,
    setMaxPage,
    user,
    page,
  ])

  useEffect(async () => {
    if (disabled) return
    setDisabled(true)

    if (user) {
      await handleSort()
    }

    await setDisabled(false)
  }, [user, page])

  const handleClickPage = useCallback(async (e) => {
    setPage(e.currentTarget.value)
  }, [setPage])

  const handleClickFinish = useCallback(async (id) => {
    await csrf()

    await axios.post(`/api/corapura/post_app/state_change/${id}`, {
      c_post_id: id,
      state: 1,
    }).then((res) => {
      // console.log(res)
    }).catch(e => console.error(e))
  }, [])

  return (
    <section className="cont1">
      <Container small>
        <h2 className="ttl1">作成した案件一覧</h2>
        <Link href={`/corapura/editor/matter/create`}>
          <a className={styles.createLink}>
            <img src={plus.src} alt="" />
            案件を新規作成
          </a>
        </Link>
        {!disabled ?
          <>
            <article className={styles.itemList}>
              {matters.map((matter, index) => (
                <div className={styles.itemBox} key={index}>
                  <Link href={`/corapura/matter/${matter.id}`}>
                    <a className={styles.imgBox}>
                      <img src={matter.thumbs ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${matter.thumbs}` : dummy.src} alt="" />
                    </a>
                  </Link>
                  <p className={styles.ttl}>{matter.title}</p>
                  <p className={styles.iconBox}>
                    <span className={styles.icon}>更新日</span>
                    <Date dateString={matter.updated_at} />
                  </p>
                  <div className={styles.btnFlex}>
                    <Link href={`/corapura/editor/matter/${matter.id}`}>
                      <a className={`${styles.btn} hoverEffect`}>編集する</a>
                    </Link>
                    {/* <button
                      type="button"
                      className={`${styles.btn} ${styles.finishBtn} hoverEffect`}
                      onClick={() => handleClickFinish(matter.id)}
                    >完了に変更</button> */}
                  </div>
                </div>
              ))}
            </article>
            {parseInt(maxPage) > 1 ?
              <div className={styles.pager}>
                {parseInt(nowPage) > 1 ?
                  <button
                    className={styles.btn}
                    value={nowPage-1}
                    onClick={handleClickPage}
                  >
                    <img src={prev.src} alt="" />
                    <span>前のページへ</span>
                  </button>
                : null}
                <div className={styles.pagerBtn}>
                  {parseInt(nowPage) > 1 ?
                    <button
                      className="hoverEffect"
                      value={nowPage-1}
                      onClick={handleClickPage}
                    >
                      {nowPage-1}
                    </button>
                  : null}
                  <button type="button" className={styles.current}>{nowPage}</button>
                  {parseInt(maxPage) !== parseInt(nowPage) ?
                    <button
                      className="hoverEffect"
                      value={nowPage+1}
                      onClick={handleClickPage}
                    >
                      {nowPage+1}
                    </button>
                  : null}
                </div>
                {parseInt(nowPage) !== parseInt(maxPage) ?
                  <button
                    className={styles.btn}
                    value={nowPage+1}
                    onClick={handleClickPage}
                  >
                    <img src={next.src} alt="" />
                    <span>次のページへ</span>
                  </button>
                : null}
              </div>
            : null}
          </>
        : <Loader />}
      </Container>
    </section>
  );
}

export default AdminMatterList;

AdminMatterList.getLayout = function getLayout(page) {
  return <PageLayoutCorapura>{page}</PageLayoutCorapura>
}