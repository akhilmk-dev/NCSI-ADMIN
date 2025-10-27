import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from 'reactstrap'
import Breadcrumb from 'components/Common/Breadcrumb2'
import { useTranslation } from 'react-i18next'


const NewsList=()=>{
    const [isOpen, setIsOpen] = useState(false)
      const dispatch = useDispatch()
      const navigate = useNavigate()
      const {t}= useTranslation()

      const news=useSelector((state)=>state.News.news)
      const loading=useSelector((state)=>state.News.loading)
      const error=useSelector((state)=>state.News.error);
      const fieldErrors=useSelector((state)=>state?.News?.fieldErrors);

      


}
