import Container from '@/components/corapura/Layout/container'
import styles from '@/styles/corapura/components/matterDetail.module.scss'
import starB from '@/images/corapura/common/starB.svg'
import starA from '@/images/corapura/common/starA.svg'
import dummy from '@/images/corapura/common/dummy1.svg'
import { Btn, Conditions, ShowEditor } from '@/components/corapura'
import { useAuth } from '@/hooks/auth'
import { useCallback, useEffect, useState } from 'react'
import axios from '@/lib/axios'
import mail from '@/images/corapura/common/mail_icon.svg'
import question from '@/images/corapura/common/question_icon.svg'
import Link from 'next/link'
import { useRouter } from 'next/router'

const MatterDetail = ({posts}) => {
  // console.log(posts);
  const csrf = () => axios.get('/sanctum/csrf-cookie')

  const router = useRouter()
  const { user } = useAuth()
  const [disabled, setDisabled] = useState(false)
  const [bookmark, setBookmark] = useState([])
  const [myMatter, setMyMatter] = useState(false)
  const [appList, setAppList] = useState([])
  const [state, setState] = useState([])

  const onLoadCheck = async () => {
    await csrf()

    await axios.post('/api/corapura/post_bookmark/check', {
      user_id: user?.id,
    }).then((res) => {
      // console.log(res)
      setBookmark(res.data)
    }).catch((e) => {
      console.error(e)
    })
  }

  const onMatterStatus = async () => {
    await csrf()
    setMyMatter(true)

    await axios.post(`/api/corapura/post_app/list`, {
      c_post_id: posts.id,
    }).then((res) => {
      // console.log(res)
      setAppList(res.data.c_post_apps)
      setState(res.data.c_post_apps.map((app) => {
        return app.pivot.state
      }))
    }).catch(e => console.error(e))
  }

  useEffect(() => {
    if (user) {
      onLoadCheck()
    }

    if (user && parseInt(user?.id) === parseInt(posts.user_id)) {
      onMatterStatus()
    }
  }, [user])

  const handleClickFinish = useCallback(async () => {
    await csrf()

    await axios.post(`/api/corapura/post/compleate/${posts.id}`, {
      state: 1,
    }).then((res) => {
      // console.log(res)
      alert("???????????????????????????????????????")
      router.reload()
    }).catch(e => console.error(e))
  }, [])

  const handleClickBookmark = useCallback(async () => {
    if (disabled) return
    setDisabled(true)
    await csrf()

    if (bookmark.includes(posts.id)) {
      await axios.delete('/api/corapura/post_bookmark/delete', {
        data: {
          user_id: user?.id,
          c_post_id: posts.id,
        }
      }).then((res) => {
        // console.log(res)
        setBookmark(res.data)
      }).catch((e) => {
        console.error(e)
      })
    } else {
      await axios.post('/api/corapura/post_bookmark/store', {
        user_id: user?.id,
        c_post_id: posts.id,
      }).then((res) => {
        // console.log(res)
        setBookmark(res.data)
      }).catch((e) => {
        console.error(e)
      })
    }

    await setDisabled(false)
  }, [disabled, setDisabled, user, bookmark, setBookmark])

  const handleChangeState = useCallback(async (e, current) => {
    setState(state.map((st, index) => (index === current ? parseInt(e.target.value) : parseInt(st))))
  }, [state, setState])

  const handleClickState = useCallback(async (status, id, name) => {
    await csrf()

    if (parseInt(status) === parseInt(5)) {
      await axios.delete(`/api/corapura/post_app/delete`, {
        data: {
          app_id: id,
        }
      }).then((res) => {
        // console.log(res)
        setAppList(res.data.c_post_apps)
        setState(res.data.c_post_apps.map((app) => {
          return app.pivot.state
        }))
        alert(`${name}????????????????????????????????????`)
      }).catch(e => console.error(e))
    } else {
      await axios.post(`/api/corapura/post_app/state_change/${id}`, {
        state: status,
      }).then((res) => {
        // console.log(res)
        if (parseInt(status) === 3) {
          alert(`${name}??????????????????????????????`)
        } else if (parseInt(status) === 0) {
          alert(`${name}????????????????????????????????????`)
        }
      }).catch(e => console.error(e))
    }
  }, [setAppList, setState])

  return (
    <section className="cont1">
      <Container small>
        <div className={styles.headFlex}>
          <div className={styles.headLeft}>
            <img src={posts.thumbs ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${posts.thumbs}` : dummy.src} alt="" />
            <button
              type="button"
              className={`${styles.bookmarkBtn} hoverEffect`}
              onClick={handleClickBookmark}
            >
              <img src={bookmark.includes(posts.id) ? starA.src : starB.src} alt="" />
            </button>
          </div>
          <div className={styles.headRight}>
            <p className={styles.cat}>{posts.c_cat.name}</p>
            <p className={styles.ttl}>{posts.title}</p>
            <div className={styles.tags}>
              {posts.c_tags.map((tag, index) => (
                <p className={styles.tag} key={index}>{tag.name}</p>
              ))}
            </div>
            <div className={styles.company}>
              <div className={styles.logoBox}>
                {posts.user.c_profile.thumbs ? <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${posts.user.c_profile.thumbs}`} alt="" /> : null}
              </div>
              {posts.user.c_profile.nicename}
            </div>
          </div>
        </div>

        <Conditions data={posts} />

        <div className={styles.editArea}>
          <ShowEditor data={posts} />
        </div>

        {myMatter ?
          <div className={styles.myMatterBox}>
            {posts.state < 1 ?
              <>
                <h3 className={styles.ttl2}>????????????????????????????????????<br className="sp" />?????????????????????????????????</h3>
                {appList.map((list, index) => (
                  <div className={styles.list} key={index}>
                    <div className={styles.left}>
                      <div className={styles.imgBox}>
                        {list.c_profile.thumbs ? <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${list.c_profile.thumbs}`} alt="" /> : null}
                      </div>
                      <Link href={`/corapura/${list.account_type === 0 ? "influencer" : "company"}/${list.id}`}>
                        <a className={styles.name}>{list.c_profile.nicename}</a>
                      </Link>
                    </div>
                    <div className={styles.right}>
                      <select value={state[index]} onChange={(e) => handleChangeState(e, index)}>
                        <option value="0">?????????</option>
                        <option value="3">??????</option>
                        <option value="5">?????????</option>
                      </select>
                      <button
                        className={`${styles.btn3} hoverEffect`}
                        onClick={() => handleClickState(state[index], list.pivot.id, list.c_profile.nicename)}
                      >????????????</button>
                    </div>
                  </div>
                ))}
                <div className="btnCover" onClick={handleClickFinish}>
                  <Btn txt="??????????????????????????????" />
                </div>
              </>
            : null}
          </div>
        :
          <div className={styles.btnFlex}>
            <a href={`mailto:${posts.user.email}`} className={styles.btn}>
              <img src={mail.src} alt="" />
              <span>???????????????????????????????????????</span>
            </a>
            <a href={`/corapura`} className={`${styles.btn} ${styles.btn2}`}>
              <img src={question.src} alt="" />
              <span>????????????</span>
            </a>
          </div>
        }
      </Container>
    </section>
  );
}

export default MatterDetail;