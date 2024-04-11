import getChoices from '@/actions/getChoices'
import React from 'react'
import Selection from './Selection'

const page = async ({ params }) => {
  const classes = await getChoices();

  return <Selection classes={classes} params={params} />;
}

export default page