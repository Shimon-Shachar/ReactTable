import React, { Fragment } from 'react';
import MainHeader from './MainHeader';

const Layout = (props) => {
  console.log("props.empty==>", props.empty);
  return (
    <Fragment>
      <MainHeader empty={props.empty} error={props.error} refresh={props.refresh} loading={props.loading}/>
      <main>{props.children}</main>
    </Fragment>
  );
};

export default Layout;
