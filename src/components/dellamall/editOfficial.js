import styles from '@/styles/dellamall/components/adminForm.module.scss'
import { OfficialContext } from "@/pages/dellamall/admin/shop/official/[id]";
import { useCallback, useContext, useEffect, useState } from "react";
import Container from './Layouts/container';
import { useForm } from 'react-hook-form';
import axios from '@/lib/axios';
import { Loader } from '@/components/dellamall';
import { socialNetworkingService } from '@/lib/dellamall/constants';

const EditOfficial = () => {
  const csrf = () => axios.get('/sanctum/csrf-cookie')

  const {
    shop,
    type,
    setOverviews,
    setCoupons,
    setSocials,
    setInfos,
    setInstagram,
    setItems,
    handleClickCreate,
    handleClickEdit,
    disabled,
    setDisabled,
    setEditData,
    editData,
  } = useContext(OfficialContext)

  const [preview, setPreview] = useState()
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    mode: "onChange",
  })

  const onLoadDefault = async () => {
    if (type === "overview") {
      setValue("overviewItem", editData.title)
      setValue("overviewContent", editData.content)
    } else if (type === "coupon") {
      setValue("couponContent", editData.title)
      setValue("couponPrice", editData.content)
      setValue("couponLimit", editData.limit)
    } else if (type === "social") {
      setValue("socialName", editData.name)
      setValue("socialUrl", editData.link)
    } else if (type === "info") {
      setValue("infoDate", editData.title)
      setValue("infoContent", editData.content)
    } else if (type === "instagram") {
      setValue("instagramAccount", editData.account_name)
      setValue("instagramUser", editData.user_name)
      setValue("instagramToken", editData.api_token)
    } else if (type === "item") {
      setValue("itemName", editData.title)
      setValue("itemPrice", editData.price)
      setPreview(`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${editData.thumbs}`)
    }
  }

  useEffect(() => {
    if (!disabled) {
      onLoadDefault()
    }
  }, [disabled])

  const onSubmitOverview = async (data) => {
    // console.log(data)
    if (disabled) return
    setDisabled(true)
    await csrf()

    await axios.post(`/api/dellamall/d_overviews/update/${editData.id}`, {
      title: data.overviewItem,
      content: data.overviewContent
    }).then((res) => {
      // console.log(res)
      setOverviews(res.data)
      alert("?????????????????????")
      handleClickCreate(type)
    }).catch((e) => {
      console.error(e)
      alert("?????????????????????????????????")
    })

    await setDisabled(false)
  }

  const onSubmitCoupon = async (data) => {
    // console.log(data)
    if (disabled) return
    setDisabled(true)
    await csrf()

    await axios.post(`/api/dellamall/d_coupons/update/${editData.id}`, {
      title: data.couponContent,
      content: data.couponPrice,
      limit: data.couponLimit,
    }).then((res) => {
      // console.log(res)
      setCoupons(res.data)
      alert("?????????????????????")
      handleClickCreate(type)
    }).catch((e) => {
      console.error(e)
      alert("?????????????????????????????????")
    })

    await setDisabled(false)
  }

  const onSubmitSocial = async (data) => {
    // console.log(data)
    if (disabled) return
    setDisabled(true)
    await csrf()

    await axios.post(`/api/dellamall/d_socials/update/${editData.id}`, {
      name: data.socialName,
      link: data.socialUrl,
    }).then((res) => {
      // console.log(res)
      setSocials(res.data)
      alert("?????????????????????")
      handleClickCreate(type)
    }).catch((e) => {
      console.error(e)
      alert("?????????????????????????????????")
    })

    await setDisabled(false)
  }

  const onSubmitInfo = async (data) => {
    // console.log(data)
    if (disabled) return
    setDisabled(true)
    await csrf()

    await axios.post(`/api/dellamall/d_infos/update/${editData.id}`, {
      title: data.infoDate,
      content: data.infoContent,
    }).then((res) => {
      // console.log(res)
      setInfos(res.data)
      alert("?????????????????????")
      handleClickCreate(type)
    }).catch((e) => {
      console.error(e)
      alert("?????????????????????????????????")
    })

    await setDisabled(false)
  }

  const onSubmitInstagram = async (data) => {
    // console.log(data)
    if (disabled) return
    setDisabled(true)
    await csrf()

    await axios.post(`/api/dellamall/d_insta/update/${editData.id}`, {
      account_name: data.instagramAccount,
      user_name: data.instagramUser,
      api_token: data.instagramToken,
    }).then((res) => {
      // console.log(res)
      alert("?????????????????????")
      handleClickCreate(type)
    }).catch((e) => {
      console.error(e)
      alert("?????????????????????????????????")
    })

    await setDisabled(false)
  }

  const onSubmitItem = async (data) => {
    // console.log(data)
    if (disabled) return
    setDisabled(true)
    await csrf()

    const datas = {
      title: data.itemName,
      price: data.itemPrice,
      thumbs: data.itemImage && data.itemImage?.length !== 0 ? data.itemImage[0] : editData.thumbs,
    }

    const params = new FormData();
    Object.keys(datas).forEach(function(key) {
      params.append(key, this[key])
    }, datas)

    await axios.post(`/api/dellamall/d_items/update/${editData.id}`, params, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => {
      // console.log(res)
      setItems(res.data)
      alert("?????????????????????")
      handleClickCreate(type)
    }).catch((e) => {
      console.error(e)
      alert("?????????????????????????????????")
    })

    await setDisabled(false)
  }

  const handleChangeFile = useCallback((e) => {
    const { files } = e.target
    if (files[0]) {
      setPreview(window.URL.createObjectURL(files[0]))
    } else {
      setPreview(`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${editData.thumbs}`)
    }
  }, [setPreview])

  return (
    <section className={styles.popupArea} onClick={() => handleClickCreate(type)}>
      <Container small900>
        <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
          <h4 className={styles.midashi}>
            {type === "overview" ? "??????????????????" : null}
            {type === "coupon" ? "??????????????????" : null}
            {type === "social" ? "??????SNS??????" : null}
            {type === "info" ? "????????????" : null}
            {type === "instagram" ? "Instagram??????" : null}
            {type === "item" ? "????????????" : null}
            ??????
          </h4>
          {disabled ? <Loader /> :
            <article className={styles.formArea}>
              {/* ???????????????????????? */}
              {type === "overview" ?
                <form onSubmit={handleSubmit(onSubmitOverview)}>
                  <dl>
                    <dt>
                      <label htmlFor="overviewItem">??????</label>
                    </dt>
                    <dd>
                      <input
                        type="text"
                        id="overviewItem"
                        {...register("overviewItem", {required: true})}
                        placeholder="?????????????????????"
                      />
                      {errors.overviewItem && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  <dl>
                    <dt>
                      <label htmlFor="overviewContent">???????????????</label>
                    </dt>
                    <dd>
                      <input
                        type="text"
                        id="overviewContent"
                        {...register("overviewContent", {required: true})}
                        placeholder="080???1111???2222/xxxyyy@gmail.com"
                      />
                      {errors.overviewContent && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  <button className={`${styles.btn} hoverEffect`}>??????</button>
                </form>
              : null}
              {/* ???????????????????????? */}

              {/* ?????????????????? */}
              {type === "coupon" ?
                <form onSubmit={handleSubmit(onSubmitCoupon)}>
                  <dl>
                    <dt>
                      <label htmlFor="couponContent">??????????????????</label>
                    </dt>
                    <dd>
                      <input
                        type="text"
                        id="couponContent"
                        {...register("couponContent", {required: true})}
                        placeholder="???????????????????????????100????????????"
                      />
                      {errors.couponContent && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  <dl>
                    <dt>
                      <label htmlFor="couponPrice">????????????</label>
                    </dt>
                    <dd>
                      <input
                        type="text"
                        id="couponPrice"
                        {...register("couponPrice", {required: true})}
                        placeholder="100???"
                      />
                      {errors.couponPrice && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  <dl>
                    <dt>
                      <label htmlFor="couponLimit">????????????</label>
                    </dt>
                    <dd>
                      <input
                        type="date"
                        id="couponLimit"
                        {...register("couponLimit", {required: true})}
                      />
                      {errors.couponLimit && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  <button className={`${styles.btn} hoverEffect`}>??????</button>
                </form>
              : null}
              {/* ?????????????????? */}

              {/* ??????SNS?????? */}
              {type === "social" ?
                <form onSubmit={handleSubmit(onSubmitSocial)}>
                  <dl>
                    <dt>SNS???</dt>
                    <dd>
                      <select {...register("socialName")}>
                        {socialNetworkingService.map((sns, index) => (
                          <option value={sns} key={index}>{sns}</option>
                        ))}
                      </select>
                    </dd>
                  </dl>
                  <dl>
                    <dt>
                      <label htmlFor="socialUrl">SNS?????????URL</label>
                    </dt>
                    <dd>
                      <input
                        type="url"
                        id="socialUrl"
                        {...register("socialUrl", {required: true})}
                        placeholder="SNS??????????????????????????????????????????"
                      />
                      {errors.socialUrl && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  <button className={`${styles.btn} hoverEffect`}>??????</button>
                </form>
              : null}
              {/* ??????SNS?????? */}

              {/* ???????????? */}
              {type === "info" ?
                <form onSubmit={handleSubmit(onSubmitInfo)}>
                  <dl>
                    <dt>
                      <label htmlFor="infoDate">??????</label>
                    </dt>
                    <dd>
                      <input
                        type="date"
                        id="infoDate"
                        {...register("infoDate", {required: true})}
                      />
                      {errors.infoDate && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  <dl>
                    <dt>
                      <label htmlFor="infoContent">??????????????????</label>
                    </dt>
                    <dd>
                      <input
                        type="text"
                        id="infoContent"
                        {...register("infoContent", {required: true})}
                        placeholder="??????????????????????????????????????????"
                      />
                      {errors.infoContent && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  <button className={`${styles.btn} hoverEffect`}>??????</button>
                </form>
              : null}
              {/* ???????????? */}

              {/* Instagram?????? */}
              {type === "instagram" ?
                <form onSubmit={handleSubmit(onSubmitInstagram)}>
                  <dl>
                    <dt>
                      <label htmlFor="instagramAccount">??????????????????</label>
                    </dt>
                    <dd>
                      <input
                        type="text"
                        id="instagramAccount"
                        {...register("instagramAccount", {required: true})}
                      />
                      {errors.instagramAccount && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  <dl>
                    <dt>
                      <label htmlFor="instagramUser">????????????</label>
                    </dt>
                    <dd>
                      <input
                        type="text"
                        id="instagramUser"
                        {...register("instagramUser", {required: true})}
                      />
                      {errors.instagramUser && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  <dl>
                    <dt>
                      <label htmlFor="instagramToken">API????????????</label>
                    </dt>
                    <dd>
                      <input
                        type="text"
                        id="instagramToken"
                        {...register("instagramToken", {required: true})}
                      />
                      {errors.instagramToken && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  <button className={`${styles.btn} hoverEffect`}>??????</button>
                </form>
              : null}
              {/* Instagram?????? */}

              {/* ?????????????????? */}
              {type === "item" ?
                <form onSubmit={handleSubmit(onSubmitItem)}>
                  <dl>
                    <dt>
                      <label htmlFor="itemName">?????????</label>
                    </dt>
                    <dd>
                      <input
                        type="text"
                        id="itemName"
                        {...register("itemName", {required: true})}
                        placeholder="???????????????????????????"
                      />
                      {errors.itemName && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  <dl>
                    <dt>
                      <label htmlFor="itemPrice">??????</label>
                    </dt>
                    <dd>
                      <input
                        type="text"
                        id="itemPrice"
                        {...register("itemPrice", {required: true})}
                        placeholder="2,800(??????)"
                      />
                      {errors.itemPrice && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  <dl>
                    <dt>
                      <label htmlFor="itemImage">????????????</label>
                    </dt>
                    <dd>
                      <div className={styles.imgBox}>
                        {preview ? <img src={preview} alt="" /> : <div className={styles.imgNone}>????????????????????????????????????</div>}
                      </div>
                      <input
                        type="file"
                        id="itemImage"
                        accept="image/*"
                        {...register("itemImage")}
                        onChange={handleChangeFile}
                      />
                      {errors.itemImage && <p className={styles.error}>???????????????????????????????????????</p>}
                    </dd>
                  </dl>
                  <button className={`${styles.btn} hoverEffect`}>??????</button>
                </form>
              : null}
              {/* ?????????????????? */}
            </article>
          }
        </div>
      </Container>
    </section>
  );
}

export default EditOfficial;