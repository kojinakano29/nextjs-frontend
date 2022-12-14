import styles from '@/styles/corapura/components/salon.module.scss'
import PageLayoutCorapura from "@/components/Layouts/pageLayoutCorapura";
import Container from '@/components/corapura/Layout/container';
import dummy from '@/images/corapura/common/dummy6.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faUserGroup,
  faMoneyBillWave,
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '@/hooks/auth';
import { useCallback, useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { Btn, ShowEditor } from '@/components/corapura';
import userIcon from '@/images/corapura/common/user.svg'

export const getServerSideProps = async ({params}) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_CORAPURA}/salon/show/${params.id}`)
  const data = await res.json()

  return {
    props: {
      posts: data
    }
  }
}

const OnlineSalonDetail = ({posts}) => {
  // console.log(posts)
  const csrf = () => axios.get('/sanctum/csrf-cookie')

  const { user } = useAuth()

  const salon = posts.salon
  const profile = posts?.user?.c_profile
  const influencer = profile?.c_user_profile
  const company = profile?.c_company_profile

  const [disabled, setDisabled] = useState(false)
  const [followCheck, setFollowCheck] = useState(false)
  const [planCheck, setPlanCheck] = useState(false)

  const onLoadCheck = async () => {
    await csrf()

    await axios.post('/api/corapura/salon_bookmark/check', {
      user_id: user?.id,
    }).then((res) => {
      // console.log(res)
      if (res.data.includes(salon.id)) {
        setFollowCheck(true)
      }
    }).catch((e) => {
      console.error(e)
    })

    await axios.post(`/api/corapura/salon_app/check`, {
      user_id: user?.id,
      c_salon_id: salon.id,
    }).then((res) => {
      // console.log(res)
      if (res.data.includes(salon.id)) {
        setPlanCheck(true)
      }
    }).catch(e => console.error(e))
  }

  useEffect(() => {
    if (user) {
      onLoadCheck()
    }
  }, [user])

  const handleClickFollow = useCallback(async () => {
    if (disabled) return
    setDisabled(true)
    await csrf()

    if (followCheck) {
      await axios.delete('/api/corapura/salon_bookmark/delete', {
        data: {
          user_id: user?.id,
          c_salon_id: salon.id,
        }
      }).then((res) => {
        // console.log(res)
        setFollowCheck(false)
      }).catch((e) => {
        console.error(e)
      })
    } else {
      await axios.post('/api/corapura/salon_bookmark/store', {
        user_id: user?.id,
        c_salon_id: salon.id,
      }).then((res) => {
        // console.log(res)
        setFollowCheck(true)
      }).catch((e) => {
        console.error(e)
      })
    }

    await setDisabled(false)
  }, [disabled, setDisabled, user, followCheck, setFollowCheck, salon])

  const handleClickPlan = useCallback(async () => {
    if (disabled) return
    setDisabled(true)
    await csrf()

    if (planCheck) {
      await axios.delete(`/api/corapura/salon_app/delete`, {
        data: {
          user_id: user?.id,
          c_salon_id: salon.id
        }
      }).then((res) => {
        // console.log(res)
        setPlanCheck(false)
      }).catch(e => console.error(e))
    } else {
      await axios.post(`/api/corapura/salon_app/store`, {
        user_id: user?.id,
        c_salon_id: salon.id
      }).then((res) => {
        // console.log(res)
        setPlanCheck(true)
      }).catch(e => console.error(e))
    }

    await setDisabled(false)
  }, [disabled, setDisabled, user, salon, planCheck])

  return (
    <section className="cont1">
      <Container small>
        <div className={styles.detailFlex}>
          <div className={styles.detailLeft}>
            <h2 className="ttl2">{salon.title}</h2>
            <div className={styles.headFlex}>
              <div className={styles.tags}>
                {salon.c_tags.map((tag, index) => (
                  <p className={styles.tag} key={index}>{tag.name}</p>
                ))}
              </div>
              <button
                type="button"
                className={`hoverEffect ${followCheck ? styles.on : null}`}
                onClick={handleClickFollow}
              >{followCheck ? "???????????????" : "??????????????????"}</button>
            </div>
            <div className={styles.imgBox}>
              <img src={salon.thumbs ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${salon.thumbs}` : dummy.src} alt="" />
            </div>
            <div className={styles.conditions}>
              <div className={styles.block}>
                <div className={styles.cat}>
                  <FontAwesomeIcon icon={faCalendarCheck} />
                  ????????????
                </div>
                <p className={styles.txt}>{salon.date}</p>
              </div>
              <div className={styles.block}>
                <div className={styles.cat}>
                  <FontAwesomeIcon icon={faMoneyBillWave} />
                  ??????????????????
                </div>
                <p className={styles.txt}>{salon.plan}</p>
              </div>
              <div className={styles.block}>
                <div className={styles.cat}>
                  <FontAwesomeIcon icon={faUserGroup} />
                  ??????????????????
                </div>
                <p className={styles.txt}>{salon.number_of_people}</p>
              </div>
            </div>

            <div className={styles.editArea}>
              <ShowEditor data={salon} />
            </div>
          </div>
          <div className={styles.detailRight}>
            <div className={styles.userBox}>
              <p className={styles.ttl}>??????????????????</p>
              <p className={styles.name}>{profile.nicename}</p>
              <p className={styles.profile}>{profile.profile}</p>
              <p className={styles.ttl}>SNS</p>
              {influencer?.c_user_socials?.map((social, index) => (
                <a href={social.url} target="_blank" key={index}>{social.url}</a>
              ))}
              {company?.c_company_socials?.map((company, index) => (
                <a href={company.url} target="_blank" key={index}>{company.url}</a>
              ))}
            </div>
            <button
              type="button"
              className={`${styles.btn} ${planCheck ? styles.on : null}`}
              onClick={handleClickPlan}
            >
              <img src={userIcon.src} alt="" />
              <span>{planCheck ? "????????????" : "??????????????????????????????"}</span>
            </button>
          </div>
        </div>
        <div className={styles.btnCover}>
          <Btn txt="???????????????" link="/corapura/salon/" />
        </div>
      </Container>
    </section>
  );
}

export default OnlineSalonDetail;

OnlineSalonDetail.getLayout = function getLayout(page) {
  return <PageLayoutCorapura>{page}</PageLayoutCorapura>
}