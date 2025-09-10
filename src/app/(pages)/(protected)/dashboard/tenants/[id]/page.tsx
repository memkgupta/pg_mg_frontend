import React from 'react'

const ViewTenant = ({params}:{params:{id:string}}) => {
  return (
    <div>{params.id
    }</div>
  )
}

export default ViewTenant