import styles from '@/styles/dellamall/components/adminForm.module.scss'
import { Loader } from "@/components/dellamall";
import Container from "@/components/dellamall/Layouts/container";
import PageLayoutDellamall from "@/components/Layouts/PageLayoutDellamall";
import { useAuth } from "@/hooks/auth";
import axios from "@/lib/axios";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const CreateShop = () => {
  const csrf = () => axios.get('/sanctum/csrf-cookie')

  const router = useRouter()
  const { user } = useAuth({middleware: 'auth', type: 'dellamall'})
  const [disabled, setDisabled] = useState(false)
  const { register, handleSubmit, getValues, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    mode: "onChange",
  })
  const [preview, setPreview] = useState()
  const [officialCheck, setOfficialCheck] = useState(true)
  const [imgName, setImgName] = useState("")

  useEffect(() => {
    if (user?.account_type > 0) {
      setOfficialCheck(false)
    }
  }, [user])

  // const handleChangeFile = useCallback((e) => {
  //   const { files } = e.target
  //   if (files[0]) {
  //     setPreview(window.URL.createObjectURL(files[0]))
  //   } else {
  //     setPreview("")
  //   }
  // }, [])

  const onShopCreate = useCallback(async (data) => {
    await csrf()

    // const params = new FormData();
    // Object.keys(data).forEach(function(key) {
    //   params.append(key, this[key])
    // }, data)

    await axios.post('/api/dellamall/shop/store', data)
    .then((res) => {
      // console.log(res)
      alert("ショップを作成しました。")
      router.push({
        pathname: '/dellamall/admin/shop/',
      })
    }).catch((e) => {
      console.error(e)
      alert("ショップの作成に失敗しました。")
    })

    await setDisabled(false)
  }, [setDisabled])

  const onSubmit = useCallback(async (data) => {
    // console.log(data)
    setDisabled(true)

    onShopCreate({
      user_id: user?.id,
      url: data.url,
      name: data.name,
      tag: data.tag,
      description: data.description,
      thumbs: preview,
      imgname: imgName,
    })
  }, [setDisabled, onShopCreate, user, preview, imgName])

  const handleClickSiteData = async (url) => {
    // console.log(url)
    await setDisabled(true)
    await csrf()

    await axios.post('/api/dellamall/shop_create_url', {
      url: url,
    }).then((res) => {
      // console.log(res)
      setValue("name", res.data.title)
      setValue("tag", res.data.keyword)
      setValue("description", res.data.description)
      setPreview(res.data.imgsrc)
      setImgName(res.data.imgname)
      alert("サイト情報の取得に成功しました。")
    }).catch((e) => {
      console.error(e)
      alert("サイト情報の取得に失敗しました。")
    })

    await setDisabled(false)
  }

  return (
    <section className={`${styles.adminForm} cont1`}>
      <Container small>
        <h2 className="ttl2">ショップ作成</h2>
        {user ?
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3 className={styles.infoTtl}>基本情報</h3>
            <p className={styles.desc}>※公式ショップ申請をされていない場合、サイトURL以外の情報は入力できません。</p>
            <article className={styles.infoFlex}>
              <div className={styles.infoLeft}>
                <dl>
                  <dt>
                    <label htmlFor="thumbs">キャプチャ画像</label>
                  </dt>
                  <dd>
                    <div className={styles.imgBox}>
                      {preview ? <img src={preview} alt="" /> : <div className={styles.imgNone}>ショップのキャプチャが入ります</div>}
                    </div>
                    {/* <label htmlFor="thumbs" className={`${styles.thumbsBox} ${officialCheck ? styles.disabled : 'hoverEffect'}`}>
                      キャプチャを選択する
                      <input
                        type="file"
                        id="thumbs"
                        accept="image/*"
                        {...register("thumbs")}
                        onChange={handleChangeFile}
                        disabled={officialCheck}
                      />
                    </label> */}
                  </dd>
                </dl>
              </div>
              <div className={styles.infoRight}>
                <dl>
                  <dt>
                    <label htmlFor="url">サイトURL</label>
                  </dt>
                  <dd>
                    <input
                      type="text"
                      id="url"
                      {...register("url", { required: true })}
                      placeholder="https://xxxyyy.....jp"
                    />
                    {errors.url && <p className={styles.error}>必須項目を入力してください</p>}
                  </dd>
                </dl>
                {disabled ? <Loader /> :
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btn2} hoverEffect`}
                    onClick={() => handleClickSiteData(getValues("url"))}
                    disabled={disabled}
                  >サイト情報を取得する</button>
                }
                <dl>
                  <dt>
                    <label htmlFor="name">サイト名</label>
                  </dt>
                  <dd>
                    <input
                      type="text"
                      id="name"
                      {...register("name", { required: true })}
                      placeholder="サイト名、お店の名前を入れてください"
                      disabled={officialCheck}
                    />
                    {errors.name && <p className={styles.error}>必須項目を入力してください</p>}
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="tag">関連タグ</label>
                  </dt>
                  <dd>
                    <textarea id="tag" {...register("tag")}></textarea>
                    <p className={styles.txt}>
                      ※アパレルショップであれば、
                      <br />「アパレル」「メンズ」「カジュアル」など！サイトに合ったタグを設定できます
                      <br />※公式ショップ申請をされていない場合、関連タグは最大３つまでしか設定できません
                    </p>
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="desc">サイト説明文</label>
                  </dt>
                  <dd>
                    <textarea
                      id="desc"
                      {...register("description")}
                      placeholder="ショップの紹介をしてください！&#10;「○○がおいしい洋菓子店」「オンライン限定商品も豊富」など"
                      disabled={officialCheck}
                    ></textarea>
                  </dd>
                </dl>
              </div>
            </article>
            <button
              className={`${styles.btn} hoverEffect`}
              disabled={disabled}
            >作成</button>
          </form>
        : <Loader />}
      </Container>
    </section>
  );
}

export default CreateShop;

CreateShop.getLayout = function getLayout(page) {
  return <PageLayoutDellamall>{page}</PageLayoutDellamall>
}