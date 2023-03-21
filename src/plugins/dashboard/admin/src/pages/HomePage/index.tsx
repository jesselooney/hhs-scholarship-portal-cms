/*
 *
 * HomePage
 *
 */

import React from "react";
import pluginId from "../../pluginId";
import { DatePicker } from "@strapi/design-system";

const HomePage = () => {
  return (
    <div>
      <h1>{pluginId}&apos;s HomePage</h1>
      <p>Happy coding</p>
      <DatePicker label="Date picker" />
    </div>
  );
};

export default HomePage;
