import styles from '@/styles/top/components/option.module.scss'
import PageLayoutTop from "@/components/Layouts/pageLayoutTop";
import Container from "@/components/top/Layout/container";
import Link from "next/link";
import { Btn1, ConfirmOption, InputOption } from '@/components/top';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/auth';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import axios from '@/lib/axios';

const MypageOption = () => {
  const csrf = () => axios.get('/sanctum/csrf-cookie')

  const router = useRouter()
  const { user } = useAuth({middleware: 'auth', type: 'register'})
  const [check, setCheck] = useState(false)
  const [optionPrice, setOptionPrice] = useState("")
  const [disabled, setDisabled] = useState(false)
  const isConfirm = router.query.confirm
  const options = {
    option_100: process.env.NEXT_PUBLIC_SUBSCRIPTION_FUND_100,
    option_500: process.env.NEXT_PUBLIC_SUBSCRIPTION_FUND_500,
    option_1000: process.env.NEXT_PUBLIC_SUBSCRIPTION_FUND_1000,
  }

  const onLoadSubscriptionCheck = async () => {
    csrf()

    axios.post('/api/subscription/use_check/', {
      user_id: user?.id,
      db_name: "option",
    }).then((res) => {
      // console.log(res)

      if (res.data.stripe_status === "active") {
        setCheck(true)
      }

      if (res.data.stripe_price === options.option_100) {
        setOptionPrice(100)
      } else if (res.data.stripe_price === options.option_500) {
        setOptionPrice(500)
      } else if (res.data.stripe_price === options.option_1000) {
        setOptionPrice(1000)
      }
    }).catch(e => console.error(e))
  }

  const methods = useForm({
    mode: "onChange",
    criteriaMode: "all",
  })

  const loginCheck = async () => {
    alert("このページの閲覧権限がありません。")
    router.push({
      pathname: '/',
    })
  }

  useEffect(() => {
    if (user && parseInt(user?.id) !== parseInt(router.query.id)) {
      loginCheck()
    }

    if (user) {
      onLoadSubscriptionCheck()
    }
  }, [user])

  const handleClickOptionCancel = useCallback(async () => {
    if (disabled) return
    setDisabled(true)

    await axios.post(`/api/subscription/cancel/${user?.id}`, {
      db_name: "option",
    }).then((res) => {
      // console.log(res)
      alert("募金を解約しました")
      router.reload()
    }).catch(e => {
      console.error(e)
      setDisabled(false)
    })
  }, [user, router, disabled, setDisabled])

  return (
    <>
      <section className="cont1">
        <Container small900>
          <h2 className="ttl2">オプション</h2>
          <div className="breadcrumbBox">
            <Link href="/">
              <a>トップ</a>
            </Link>
            <div><img src="/top/breadcrumb.svg" alt="" /></div>
            <Link href="/mypage">
              <a>マイページ</a>
            </Link>
            <div><img src="/top/breadcrumb.svg" alt="" /></div>
            <p>オプション</p>
          </div>
        </Container>
      </section>

      <section className={styles.optionArea}>
        <Container small900>
          {!check ?
            <FormProvider {...methods}>
              {!isConfirm ? <InputOption user={user} /> : <ConfirmOption user={user} />}
            </FormProvider>
          :
            <div className={styles.optionNowBox}>
              <p className={styles.midashi}>お客様が現在ご契約中の募金料金</p>
              <div className={styles.optionBox}>
                <p className={styles.optionName}>募金料金</p>
                <p className={styles.optionPrice}>
                  <span className={`en ${styles.sm}`}>￥</span>
                  <span className={`en ${styles.big}`}>{optionPrice}</span>
                  <span className={styles.jp}>/月</span>
                </p>
              </div>
              <div className={styles.btnFlex}>
                <div className={styles.type2}>
                  <Btn1 txt="マイページへ戻る" link="/mypage" />
                </div>
                <div className="btnCover" onClick={handleClickOptionCancel}>
                  <Btn1 txt={"解約する"} />
                </div>
              </div>
            </div>
          }
        </Container>
      </section>
    </>
  );
}

export default MypageOption;

MypageOption.getLayout = function getLayout(page) {
  return <PageLayoutTop>{page}</PageLayoutTop>
}