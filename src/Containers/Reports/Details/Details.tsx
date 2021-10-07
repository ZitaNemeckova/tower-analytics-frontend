import React, { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Main from '@redhat-cloud-services/frontend-components/Main';
import Error404 from '../../../Components/Error404';

import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';

import Breadcrumbs from '../../../Components/Breadcrumbs';

import { ReportCard } from './Components/';
import { getReport } from '../Shared/schemas';
import paths from '../paths';

const Description = styled.p`
  max-width: 70em;
  padding-top: 8px;
`;

const Details: FunctionComponent<Record<string, never>> = () => {
  const { slug } = useParams<{ slug: string }>();
  const { name, description, report } = getReport(slug);

  const breadcrumbsItems = [{ title: 'Reports', navigate: paths.get }];

  const render = () => {
    if (report)
      return (
        <>
          <PageHeader>
            <Breadcrumbs items={breadcrumbsItems} />
            <PageHeaderTitle title={name} />
            <Description>{description}</Description>
          </PageHeader>
          <Main>
            <ReportCard {...report} />
          </Main>
        </>
      );
    else
      return (
        <Error404
          title="404: Page does not exist."
          body="The report you are looking for does not exist."
          buttonText="Return to Reports page"
          link={paths.get}
        />
      );
  };

  return render();
};

export default Details;
