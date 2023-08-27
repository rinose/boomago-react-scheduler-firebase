import React, { useEffect} from 'react'
// import context
import _ from 'lodash'

export default function BookingManager(props) {

  useEffect(() => {
    
  });

  const categories = _.uniqBy(props.services, 'category');
  const servicesCategoriesList = _.map(categories, (sc) => {
    const category = sc.category;
    const servicesList = _.filter(props.services, {category:category}).map( (s) => {
      return <div className="">{s.name}</div>
    })
    return servicesList
  });

  return (
    <div>
      Services
      <div>{servicesCategoriesList}</div>
    </div>
  )
}




